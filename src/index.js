export default class Snatch {
    constructor(options) {
        this.options = {};
        this.options.method = options && options.method ? options.method : "POST";
        this.options.url = options && options.url ? options.url : "http://localhost/";
        this.dataset = {};
        
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
            "Arial", "Helvetica", "Times New Roman", "Courier New", "Verdana", "Georgia",
            "Palatino", "Garamond", "Bookman", "Comic Sans MS", "Trebuchet MS", "Arial Black",
            "Impact", "Lucida Console", "Lucida Sans Unicode", "Tahoma", "Century Gothic",
            "Calibri", "Cambria", "Candara", "Consolas", "Corbel", "Constantia", "Franklin Gothic Medium",
            "Gill Sans", "Futura", "Baskerville", "Didot", "Rockwell", "Bodoni", "Century Schoolbook",
            "American Typewriter", "Andale Mono", "Optima", "Segoe UI", "Source Sans Pro",
            "PT Sans", "Raleway", "Lato", "Roboto", "Open Sans", "Montserrat", "Ubuntu", "Noto Sans",
            "Avenir", "Proxima Nova", "Museo Sans", "Merriweather", "Droid Sans", "Playfair Display",
            "Josefin Sans", "Oswald", "Lobster", "Quicksand", "Karla", "Work Sans", "Inter", "Cabin",
            "Arvo", "Zilla Slab", "Nunito", "Exo", "Rubik", "Muli", "Oxygen", "Inconsolata", "Anton",
            "Pacifico", "Alegreya", "Cormorant", "EB Garamond", "Asap", "Titillium Web", "Varela Round",
            "Abel", "Barlow", "Righteous", "Archivo", "Crimson Text", "Manrope", "Poppins", "Chivo",
            "Teko", "Hind", "Baloo", "Heebo", "Fjalla One", "Maven Pro", "Catamaran", "Yanone Kaffeesatz",
            "PT Serif", "Space Grotesk", "IBM Plex Sans", "Signika", "Questrial", "Bangers",
            "Dancing Script", "Fredoka", "Press Start 2P", "Shadows Into Light"
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
        await this.ready;

        const xhr = new XMLHttpRequest();
        xhr.open(this.options.method, this.options.url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(this.dataset));
    }
}