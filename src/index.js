const MAX_MOUSE_SAMPLES = 2000;
const MAX_SCROLL_SAMPLES = 1000;
const MAX_KEY_EVENTS = 500;
const MOUSE_THROTTLE_MS = 20;
const SCROLL_THROTTLE_MS = 33;
const DEFAULT_BEHAVIORAL_MIN_DURATION_MS = 1500;
const DEFAULT_BEHAVIORAL_MAX_WAIT_MS = 6000;
const DEFAULT_BEHAVIORAL_POLL_MS = 100;

function mean(values) {
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function stddev(values, avg) {
    if (!values.length) return 0;
    const variance = values.reduce((sum, value) => sum + ((value - avg) ** 2), 0) / values.length;
    return Math.sqrt(variance);
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

class BehavioralCollector {
    constructor() {
        this.startTime = this.now();
        this.firstInteractionMs = null;
        this.interactionEventCount = 0;
        this.touchEventCount = 0;
        this.hasTouchEvents = false;
        this.mouseSamples = [];
        this.scrollSamples = [];
        this.keyDownTimes = new Map();
        this.keyDwellTimes = [];
        this.keyFlightTimes = [];
        this.keydownCount = 0;
        this.lastKeydownAt = null;
        this.lastMouseAt = -Infinity;
        this.lastScrollAt = -Infinity;
        this.listeners = [];

        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            this.attach();
        }
    }

    now() {
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            return performance.now();
        }
        return Date.now();
    }

    noteInteraction() {
        this.interactionEventCount += 1;
        if (this.firstInteractionMs === null) {
            this.firstInteractionMs = Math.round(this.now() - this.startTime);
        }
    }

    pushBounded(target, value, limit) {
        if (target.length >= limit) {
            target.shift();
        }
        target.push(value);
    }

    attachListener(target, name, handler) {
        if (!target || typeof target.addEventListener !== 'function') return;
        target.addEventListener(name, handler, { passive: true });
        this.listeners.push(() => target.removeEventListener(name, handler, { passive: true }));
    }

    attach() {
        this.attachListener(window, 'mousemove', (event) => {
            const now = this.now();
            if (now - this.lastMouseAt < MOUSE_THROTTLE_MS) return;
            this.lastMouseAt = now;
            this.noteInteraction();
            this.pushBounded(this.mouseSamples, {
                t: now,
                x: event.clientX,
                y: event.clientY,
            }, MAX_MOUSE_SAMPLES);
        });

        this.attachListener(window, 'scroll', () => {
            const now = this.now();
            if (now - this.lastScrollAt < SCROLL_THROTTLE_MS) return;
            this.lastScrollAt = now;
            this.noteInteraction();
            const scrollY = typeof window.scrollY === 'number'
                ? window.scrollY
                : (document.documentElement?.scrollTop || document.body?.scrollTop || 0);
            this.pushBounded(this.scrollSamples, {
                t: now,
                y: scrollY,
            }, MAX_SCROLL_SAMPLES);
        });

        this.attachListener(window, 'touchstart', () => {
            this.noteInteraction();
            this.hasTouchEvents = true;
            this.touchEventCount += 1;
        });

        this.attachListener(window, 'keydown', (event) => {
            const now = this.now();
            this.noteInteraction();
            if (this.keydownCount < MAX_KEY_EVENTS) {
                this.keydownCount += 1;
            }
            if (this.lastKeydownAt !== null && this.keyFlightTimes.length < MAX_KEY_EVENTS) {
                this.keyFlightTimes.push(now - this.lastKeydownAt);
            }
            this.lastKeydownAt = now;
            if (!event.repeat && !this.keyDownTimes.has(event.code)) {
                this.keyDownTimes.set(event.code, now);
            }
        });

        this.attachListener(window, 'keyup', (event) => {
            const now = this.now();
            this.noteInteraction();
            const keydownAt = this.keyDownTimes.get(event.code);
            if (typeof keydownAt === 'number' && this.keyDwellTimes.length < MAX_KEY_EVENTS) {
                this.keyDwellTimes.push(now - keydownAt);
            }
            this.keyDownTimes.delete(event.code);
        });
    }

    computeMouseMetrics() {
        if (this.mouseSamples.length < 2) {
            return {
                sampleCount: this.mouseSamples.length,
                avgVelocityPxMs: 0,
                velocityStdDev: 0,
                straightnessRatio: 1,
                avgAcceleration: 0,
                hasMovement: false,
            };
        }

        const velocities = [];
        const accelerations = [];
        let totalDistance = 0;

        for (let index = 1; index < this.mouseSamples.length; index += 1) {
            const previous = this.mouseSamples[index - 1];
            const current = this.mouseSamples[index];
            const deltaT = current.t - previous.t;
            if (deltaT <= 0) continue;
            const deltaX = current.x - previous.x;
            const deltaY = current.y - previous.y;
            const distance = Math.sqrt((deltaX ** 2) + (deltaY ** 2));
            totalDistance += distance;
            velocities.push(distance / deltaT);
        }

        for (let index = 1; index < velocities.length; index += 1) {
            const deltaT = this.mouseSamples[index + 1].t - this.mouseSamples[index].t;
            if (deltaT <= 0) continue;
            accelerations.push(Math.abs(velocities[index] - velocities[index - 1]) / deltaT);
        }

        const avgVelocity = mean(velocities);
        const velocityStdDev = stddev(velocities, avgVelocity);
        const avgAcceleration = mean(accelerations);
        const first = this.mouseSamples[0];
        const last = this.mouseSamples[this.mouseSamples.length - 1];
        const displacement = Math.sqrt(((last.x - first.x) ** 2) + ((last.y - first.y) ** 2));
        const straightnessRatio = totalDistance > 0 ? clamp(displacement / totalDistance, 0, 1) : 1;

        return {
            sampleCount: this.mouseSamples.length,
            avgVelocityPxMs: Number(avgVelocity.toFixed(4)),
            velocityStdDev: Number(velocityStdDev.toFixed(4)),
            straightnessRatio: Number(straightnessRatio.toFixed(4)),
            avgAcceleration: Number(avgAcceleration.toFixed(4)),
            hasMovement: totalDistance > 0,
        };
    }

    computeKeyboardMetrics(collectionDurationMs) {
        const avgDwell = mean(this.keyDwellTimes);
        const avgFlight = mean(this.keyFlightTimes);
        const estimatedWpm = collectionDurationMs > 0
            ? (this.keydownCount / 5) / (collectionDurationMs / 60000)
            : 0;

        return {
            keystrokeCount: this.keydownCount,
            avgDwellMs: Number(avgDwell.toFixed(2)),
            dwellStdDev: Number(stddev(this.keyDwellTimes, avgDwell).toFixed(2)),
            avgFlightMs: Number(avgFlight.toFixed(2)),
            flightStdDev: Number(stddev(this.keyFlightTimes, avgFlight).toFixed(2)),
            estimatedWpm: Number(estimatedWpm.toFixed(2)),
        };
    }

    computeScrollMetrics() {
        if (this.scrollSamples.length < 2) {
            return {
                eventCount: this.scrollSamples.length,
                avgVelocityPxMs: 0,
                velocityStdDev: 0,
                directionChangeCount: 0,
                totalDistancePx: 0,
            };
        }

        const velocities = [];
        let directionChangeCount = 0;
        let lastDirection = 0;
        let totalDistancePx = 0;

        for (let index = 1; index < this.scrollSamples.length; index += 1) {
            const previous = this.scrollSamples[index - 1];
            const current = this.scrollSamples[index];
            const deltaT = current.t - previous.t;
            if (deltaT <= 0) continue;
            const deltaY = current.y - previous.y;
            const direction = Math.sign(deltaY);
            if (direction !== 0 && lastDirection !== 0 && direction !== lastDirection) {
                directionChangeCount += 1;
            }
            if (direction !== 0) {
                lastDirection = direction;
            }
            totalDistancePx += Math.abs(deltaY);
            velocities.push(Math.abs(deltaY) / deltaT);
        }

        const avgVelocity = mean(velocities);
        return {
            eventCount: this.scrollSamples.length,
            avgVelocityPxMs: Number(avgVelocity.toFixed(4)),
            velocityStdDev: Number(stddev(velocities, avgVelocity).toFixed(4)),
            directionChangeCount,
            totalDistancePx: Number(totalDistancePx.toFixed(2)),
        };
    }

    computeBehavioralMetrics() {
        const collectionDurationMs = Math.max(0, Math.round(this.now() - this.startTime));
        return {
            mouse: this.computeMouseMetrics(),
            keyboard: this.computeKeyboardMetrics(collectionDurationMs),
            scroll: this.computeScrollMetrics(),
            session: {
                sessionDurationMs: collectionDurationMs,
                timeToFirstInteractionMs: this.firstInteractionMs,
                interactionEventCount: this.interactionEventCount,
                touchEventCount: this.touchEventCount,
            },
            collectionDurationMs,
            hasTouchEvents: this.hasTouchEvents,
        };
    }

    getBehavioralState() {
        return {
            elapsedMs: Math.max(0, Math.round(this.now() - this.startTime)),
            interactionEventCount: this.interactionEventCount,
            hasTouchEvents: this.hasTouchEvents,
        };
    }

    destroy() {
        while (this.listeners.length) {
            const dispose = this.listeners.pop();
            if (dispose) {
                dispose();
            }
        }
        this.keyDownTimes.clear();
    }
}

export default class Snatch {
    constructor(options) {
        this.options = {};
        this.options.method = options && options.method ? options.method : "POST";
        this.options.url = options && options.url ? options.url : "http://localhost/";
        this.dataset = {};
        this._behavioral = new BehavioralCollector();
        
        this.ready = this.snatch();
    }

    /**
     * Snatch the browser's fingerprinting data.
     * This method collects various properties from the `navigator` object,
     */
    async snatch() {
        // Collect basic properties
        this.dataset.userAgent = navigator.userAgent;
        this.dataset.platform = navigator.platform;
        this.dataset.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.dataset.language = navigator.language || navigator.userLanguage;
        this.dataset.languages = navigator.languages;

        // Collect additional properties
        this.dataset.cookieEnabled = navigator.cookieEnabled;
        this.dataset.doNotTrack = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
        this.dataset.hardwareConcurrency = navigator.hardwareConcurrency;
        this.dataset.deviceMemory = navigator.deviceMemory || "unknown";
        this.dataset.product = navigator.product;
        this.dataset.productSub = navigator.productSub;
        this.dataset.vendor = navigator.vendor;
        this.dataset.vendorSub = navigator.vendorSub || "unknown";
        this.dataset.appName = navigator.appName;
        this.dataset.appVersion = navigator.appVersion;
        this.dataset.appCodeName = navigator.appCodeName;
        this.dataset.appMinorVersion = navigator.appMinorVersion || "unknown";
        this.dataset.buildID = navigator.buildID || "unknown";

        // Collect plugins and mime types
        this.dataset.plugins = Array.from(navigator.plugins).map(plugin => ({
            name: plugin.name,
            version: plugin.version,
            description: plugin.description
        }));
        this.dataset.mimeTypes = Array.from(navigator.mimeTypes).map(mimeType => ({
            type: mimeType.type,
            suffixes: mimeType.suffixes,
            description: mimeType.description
        }));

        // Collect screen properties
        this.dataset.screen = {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            orientation: screen.orientation ? {
                type: screen.orientation.type,
                angle: screen.orientation.angle
            } : null
        }

        // Collect font information
        this.dataset.fonts = this.detectInstalledFonts();

				// Collect canvas, WebGL, and audio fingerprints
				this.dataset.canvas = await this.getCanvasFingerprint();
				this.dataset.webgl = this.getWebGLFingerprint();
				this.dataset.audio = await this.getAudioFingerprint();

        // Collect High Entropy Values
        try {
            if ('userAgentData' in navigator && typeof navigator.userAgentData.getHighEntropyValues === 'function') {
                const data = await navigator.userAgentData.getHighEntropyValues([
                    "architecture",
                    "model",
                    "platform",
                    "platformVersion",
                    "uaFullVersion",
                    "bitness",
                    "fullVersionList"
                ]);
                this.dataset.highEntropyValues = { ...data };
            } else {
                this.dataset.highEntropyValues = {};
            }
        } catch (error) {
            console.warn("High Entropy Values not available:", error);
            this.dataset.highEntropyValues = {};
        }

        this.dataset.behavioralMetrics = this._behavioral.computeBehavioralMetrics();

        return this.dataset;
    }

    async capture(options = {}) {
        await this.ready;

        const minBehavioralDurationMs = Number.isFinite(options.minBehavioralDurationMs)
            ? Math.max(0, options.minBehavioralDurationMs)
            : DEFAULT_BEHAVIORAL_MIN_DURATION_MS;
        const maxBehavioralWaitMs = Number.isFinite(options.maxBehavioralWaitMs)
            ? Math.max(minBehavioralDurationMs, options.maxBehavioralWaitMs)
            : DEFAULT_BEHAVIORAL_MAX_WAIT_MS;
        const pollIntervalMs = Number.isFinite(options.pollIntervalMs)
            ? Math.max(16, options.pollIntervalMs)
            : DEFAULT_BEHAVIORAL_POLL_MS;
        const requireInteraction = options.requireInteraction === true;

        while (true) {
            const state = this._behavioral.getBehavioralState();
            const reachedMinWindow = state.elapsedMs >= minBehavioralDurationMs;
            const reachedMaxWindow = state.elapsedMs >= maxBehavioralWaitMs;
            const hasInteraction = state.interactionEventCount > 0 || state.hasTouchEvents;

            if (reachedMaxWindow || (reachedMinWindow && (!requireInteraction || hasInteraction))) {
                break;
            }

            await sleep(Math.min(pollIntervalMs, Math.max(16, maxBehavioralWaitMs - state.elapsedMs)));
        }

        this.dataset.behavioralMetrics = this._behavioral.computeBehavioralMetrics();
        return this.dataset;
    }

		simpleHash(str) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash; // Convert to 32-bit integer
        }
        return (hash >>> 0).toString(36); // Short, deterministic, URL-safe
    }

    detectInstalledFonts() {
        const fontList = [
            // A
            "Abel", "Abril Fatface", "Acme", "Al Bayan", "Alef", "Alegreya", "Alfa Slab One",
            "Alice", "Amatic SC", "American Typewriter", "Amiri", "Andale Mono", "Anonymous Pro",
            "Anton", "Antonio", "Apple SD Gothic Neo", "AppleGothic", "Architects Daughter",
            "Archivo", "Archivo Black", "Archivo Narrow", "Aref Ruqaa", "Arial", "Arial Black",
            "Arimo", "Arsenal", "Arvo", "Asap", "Atkinson Hyperlegible", "Audiowide", "Avenir",
            // B
            "B612", "Bad Script", "Baloo", "Baloo 2", "Baloo Da 2", "Bangers", "Barlow",
            "Barlow Condensed", "Barlow Semi Condensed", "Baskerville", "Batang",
            "Be Vietnam Pro", "Bebas Neue", "Berkshire Swash", "Biryani",
            "BIZ UDGothic", "BIZ UDMincho", "BIZ UDPGothic", "BIZ UDPMincho",
            "Bitter", "Black Han Sans", "Black Ops One", "Bodoni", "Bodoni Moda",
            "Bookman", "Boogaloo", "Brygada 1918", "Bubblegum Sans", "Bungee",
            // C
            "Cabin", "Cabin Condensed", "Cairo", "Calibri", "Cambria", "Candara",
            "Cantarell", "Catamaran", "Caveat", "Century Gothic", "Century Schoolbook",
            "Ceviche One", "Chakra Petch", "Changa", "Chivo", "Chonburi",
            "Cinzel", "Cinzel Decorative", "Clicker Script", "Coda", "Comfortaa",
            "Comic Neue", "Comic Sans MS", "Commissioner", "Concert One", "Consolas",
            "Constantia", "Cookie", "Corbel", "Corinthia", "Cormorant", "Courgette",
            "Courier New", "Coustard", "Creepster", "Crimson Text", "Cuprum",
            // D
            "DM Mono", "DM Sans", "DM Serif Display", "DM Serif Text", "Damion",
            "Dancing Script", "Days One", "Dela Gothic One", "Delius", "Didot",
            "Diplomata", "Do Hyeon", "DotGothic16", "Dotum", "Dosis", "Droid Sans",
            // E
            "Eagle Lake", "East Sea Dokdo", "EB Garamond", "Economica", "Eczar",
            "El Messiri", "Electrolize", "Encode Sans", "Epilogue", "Exo", "Exo 2",
            // F
            "Fahkwang", "Familjen Grotesk", "FangSong", "Fanwood Text", "Faustina",
            "Figtree", "Fira Code", "Fira Mono", "Fira Sans", "Fira Sans Condensed",
            "Fjalla One", "Forum", "Francois One", "Frank Ruhl Libre", "Franklin Gothic Medium",
            "Fraunces", "Freckle Face", "Fredoka", "Fugaz One", "Futura",
            // G
            "Gamja Flower", "Garamond", "Geeza Pro", "Georgia", "Germania One", "GFS Didot",
            "Gill Sans", "Gloria Hallelujah", "Gothic A1", "Gowun Batang", "Gowun Dodum",
            "Graduate", "Grand Hotel", "Grandstander", "Gravitas One", "Great Vibes",
            "Grenze Gotisch", "Gugi", "Gulim", "Gungsuh",
            // H
            "Hachi Maru Pop", "Halant", "Hammersmith One", "Happy Monkey", "Harmattan",
            "Headland One", "Heebo", "Helvetica", "Helvetica Neue", "Hepta Slab",
            "Hi Melody", "Hind", "Hind Siliguri", "Hiragino Kaku Gothic Pro",
            "Hiragino Mincho Pro", "Hiragino Sans",
            // I
            "Ibarra Real Nova", "IBM Plex Mono", "IBM Plex Sans", "IBM Plex Serif",
            "Imbue", "Impact", "Inclusive Sans", "Inconsolata", "Inknut Antiqua",
            "Inria Sans", "Inria Serif", "Instrument Sans", "Instrument Serif",
            "Inter", "Inter Tight",
            // J
            "JetBrains Mono", "Joan", "Josefin Sans", "Jost", "Jua", "Julius Sans One", "Jura",
            // K
            "K2D", "Kaisei Decol", "Kaisei HarunoUmi", "Kaisei Opti", "Kaisei Tokumin",
            "KaiTi", "Kalam", "Kameron", "Kanit", "Karla", "Katibeh", "Kavoon", "Khand",
            "Klee One", "Kosugi", "Kosugi Maru", "Kreon", "Krona One", "Kumbh Sans",
            // L
            "La Belle Aurore", "Laila", "Lalezar", "Lateef", "Lato", "League Gothic",
            "League Spartan", "Leckerli One", "Lemon", "Lemonada", "Lexend", "Lexend Deca",
            "Libre Baskerville", "Libre Caslon Text", "Libre Franklin", "Lilita One",
            "Limelight", "Literata", "Livvic", "Lobster", "Lora",
            "Lucida Console", "Lucida Grande", "Lucida Sans Unicode", "Luckiest Guy", "Lusitana",
            // M
            "M PLUS 1p", "M PLUS 2", "M PLUS Code Latin", "M PLUS Rounded 1c",
            "Macondo", "Mada", "Malgun Gothic", "Manrope", "Marcellus", "Marck Script",
            "Markazi Text", "Martel", "Martel Sans", "Marvel", "Mate", "Maven Pro",
            "Meiryo", "Merriweather", "Merriweather Sans",
            "Michroma", "Microsoft JhengHei", "Microsoft YaHei", "MingLiU", "Mirza", "Mitr",
            "Modak", "Mohave", "Monda", "Montserrat", "Montserrat Alternates",
            "MS Gothic", "MS Mincho", "MS PGothic", "MS PMincho",
            "Mukta", "Muli", "Mulish", "Museo Sans", "MuseoModerno",
            // N
            "Nanum Brush Script", "Nanum Gothic", "Nanum Myeongjo", "Nanum Pen Script",
            "News Cycle", "Newsreader", "Niramit", "Nixie One", "Nobile", "Noticia Text",
            "Noto Kufi Arabic", "Noto Naskh Arabic", "Noto Nastaliq Urdu",
            "Noto Sans", "Noto Sans Arabic", "Noto Sans Bengali", "Noto Sans Display",
            "Noto Sans Greek", "Noto Sans HK", "Noto Sans JP", "Noto Sans KR",
            "Noto Sans SC", "Noto Sans TC",
            "Noto Serif", "Noto Serif JP", "Noto Serif KR", "Noto Serif SC", "Noto Serif TC",
            "Nunito", "Nunito Sans",
            // O
            "Old Standard TT", "Oleo Script", "Open Sans", "Optima", "Orbitron",
            "Oswald", "Outfit", "Overlock", "Overpass", "Ovo", "Oxanium", "Oxygen",
            // P
            "Pacifico", "Palatino", "Palanquin", "Passion One", "Patua One", "Paytone One",
            "Permanent Marker", "Philosopher", "Piazzolla", "Play", "Playball",
            "Playfair Display", "Playfair Display SC", "Plus Jakarta Sans",
            "Podkova", "Poiret One", "Poppins", "Press Start 2P", "Pridi", "Prompt",
            "Proza Libre", "Proxima Nova", "PT Mono", "PT Sans", "PT Sans Narrow", "PT Serif",
            "Public Sans",
            // Q
            "Quattrocento", "Quattrocento Sans", "Questrial", "Quicksand",
            // R
            "Rajdhani", "Rakkas", "Raleway", "Rambla", "Ranchers", "Recursive",
            "Red Hat Display", "Red Hat Text", "Reem Kufi", "REM", "Righteous",
            "Roboto", "Roboto Condensed", "Roboto Mono", "Roboto Serif", "Roboto Slab",
            "RocknRoll One", "Rockwell", "Rokkitt", "Ropa Sans", "Rosario", "Rowdies",
            "Rozha One", "Rubik", "Ruda", "Rufina", "Russo One",
            // S
            "Sacramento", "Saira", "Sanchez", "Sansita", "Sarabun", "Satisfy",
            "Sawarabi Gothic", "Sawarabi Mincho", "Scada", "Scheherazade New",
            "Secular One", "Segoe UI", "Sen", "Shadows Into Light", "Signika",
            "SimHei", "SimSun", "Single Day", "Song Myung", "Sora",
            "Source Code Pro", "Source Sans Pro", "Source Serif 4",
            "Space Grotesk", "Space Mono", "Spectral", "Sriracha", "Srisakdi",
            "Staatliches", "Stick", "Suez One", "Sunflower", "Syne",
            // T
            "Tahoma", "Tajawal", "Tangerine", "Tauri", "Taviraj", "Teko", "Telex",
            "Tenor Sans", "Tilt Neon", "Times New Roman", "Tinos", "Titan One",
            "Titillium Web", "Tourney", "Train One", "Trebuchet MS", "Trirong",
            "Truculenta", "Tsukimi Rounded", "Turret Road",
            // U
            "Ubuntu", "Ubuntu Condensed", "Ubuntu Mono", "Ultra", "Unbounded",
            "Unica One", "Urbanist",
            // V
            "Varela", "Varela Round", "Verdana", "Vidaloka", "Viga",
            "Vollkorn", "Vollkorn SC", "Voltaire", "VT323",
            // W
            "Wellfleet", "Wendy One", "Wix Madefor Display", "Work Sans",
            // Y
            "Yanone Kaffeesatz", "Yatra One", "Yeon Sung", "Yeseva One", "Yomogi", "Yrsa",
            "Yu Gothic", "Yu Mincho", "Yuji Boku", "Yuji Mai", "Yuji Syuku", "Yusei Magic",
            // Z
            "ZCOOL KuaiLe", "ZCOOL QingKe HuangYou", "ZCOOL XiaoWei",
            "Zen Antique", "Zen Antique Soft", "Zen Kaku Gothic Antique", "Zen Kaku Gothic New",
            "Zen Kurenaido", "Zen Loop", "Zen Maru Gothic", "Zen Old Mincho",
            "Zeyada", "Zilla Slab", "Zilla Slab Highlight"
        ];

        const baseFonts = ['monospace', 'sans-serif', 'serif'];
        const testString = 'mmmmmmmmmmlli';
        const testSize = '72px';
        const detected = [];

        const body = document.body || document.getElementsByTagName('body')[0];
        if (!body) return detected;

        const span = document.createElement('span');
        span.style.fontSize = testSize;
        span.innerHTML = testString;
        span.style.position = 'absolute';
        span.style.left = '-9999px';
        span.style.visibility = 'hidden';

        body.appendChild(span);

        const defaultDims = {};
        for (const base of baseFonts) {
            span.style.fontFamily = base;
            defaultDims[base] = { width: span.offsetWidth, height: span.offsetHeight };
        }

        for (const font of fontList) {
            let detectedFont = false;
            for (const base of baseFonts) {
                span.style.fontFamily = `'${font}',${base}`;
                const width = span.offsetWidth;
                const height = span.offsetHeight;

                if (width !== defaultDims[base].width || height !== defaultDims[base].height) {
                    detectedFont = true;
                    break;
                }
            }
            if (detectedFont) {
                detected.push(font);
            }
        }

        body.removeChild(span);
        return detected;
    }

    async getCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return 'unsupported';

            // Text layer (very high entropy)
            canvas.width = 240;
            canvas.height = 60;
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = '#f60';
            ctx.fillRect(100, 1, 62, 20);
            ctx.fillStyle = '#069';
            ctx.font = '11pt "Times New Roman"';
            const text = `Cwm fjordbank gly ${String.fromCharCode(55357, 56835)}`;
            ctx.fillText(text, 2, 15);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.2)';
            ctx.font = '18pt Arial';
            ctx.fillText(text, 4, 45);

            const textData = canvas.toDataURL();

            // Geometry layer (adds winding + composite quirks)
            canvas.width = 122;
            canvas.height = 110;
            ctx.globalCompositeOperation = 'multiply';
            const colors = [['#f2f', 40, 40], ['#2ff', 80, 40], ['#ff2', 60, 80]];
            for (const [color, x, y] of colors) {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, 40, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = '#f9c';
            ctx.arc(60, 60, 60, 0, Math.PI * 2);
            ctx.arc(60, 60, 20, 0, Math.PI * 2);
            ctx.fill('evenodd');

            const geomData = canvas.toDataURL();
            return this.simpleHash(textData + '||' + geomData);
        } catch (e) {
            console.warn('Canvas FP failed:', e);
            return 'canvas_na';
        }
    }

    getWebGLFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return 'unsupported';

            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
            const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);

            const fpString = [
                vendor || '',
                renderer || '',
                gl.getParameter(gl.MAX_TEXTURE_SIZE),
                gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
                gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
                (gl.getSupportedExtensions() || []).length
            ].join('||');

            return this.simpleHash(fpString);
        } catch (e) {
            console.warn('WebGL FP failed:', e);
            return 'webgl_na';
        }
    }

    async getAudioFingerprint() {
        try {
            const AudioContextCtor = window.OfflineAudioContext || window.webkitOfflineAudioContext;
            if (!AudioContextCtor) return 'unsupported';

            const context = new AudioContextCtor(1, 44100 * 0.42, 44100);
            const oscillator = context.createOscillator();
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(10000, context.currentTime);

            const compressor = context.createDynamicsCompressor();
            compressor.threshold.value = -50;
            compressor.knee.value = 40;
            compressor.ratio.value = 12;
            compressor.attack.value = 0;
            compressor.release.value = 0.25;

            oscillator.connect(compressor);
            compressor.connect(context.destination);
            oscillator.start(0);

            const renderedBuffer = await context.startRendering();
            const channelData = renderedBuffer.getChannelData(0);

            // Stable slice + length (extremely consistent across runs)
            let dataForHash = Array.from(channelData.slice(4500, 5000))
                .map(v => v.toFixed(8))
                .join(',');
            dataForHash += `||${channelData.length}`;

            return this.simpleHash(dataForHash);
        } catch (e) {
            console.warn('Audio FP failed:', e);
            return 'audio_na';
        }
    }

    /**
     * Send the collected dataset to the target URL.
     * Now automatically waits for high-entropy data.
     */
    async send() {
        const payload = await this.capture();

        const xhr = new XMLHttpRequest();
        xhr.open(this.options.method, this.options.url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(payload));
    }

    destroy() {
        this._behavioral.destroy();
    }
}