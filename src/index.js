export default class Snatch {
    constructor(options) {
        this.options = {};
        this.options.method = options && options.method ? options.method : "POST";
        this.options.url = options && options.url ? options.url : "http://localhost/";
        this.dataset = {};
        this.snatch();
    }

    /**
     * Snatch the browser's fingerprinting data.
     * This method collects various properties from the `navigator` object,
     */
    snatch() {
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

        // Collect High Entropy Values
        try {
            var highEntropyValues = {};
            navigator.userAgentData.getHighEntropyValues([
                "architecture",
                "model",
                "platform",
                "platformVersion",
                "uaFullVersion",
                "bitness"
            ]).then(function(data) {
                for (const key in data) {
                    highEntropyValues[key] = data[key];
                }
            });
            this.dataset.highEntropyValues = highEntropyValues;
        } catch (error) {
            console.warn("High Entropy Values not available:", error);
            this.dataset.highEntropyValues = {};
        }
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
        const span = document.createElement('span');
        span.style.fontSize = testSize;
        span.innerHTML = testString;
        span.style.position = 'absolute';
        span.style.left = '-9999px';
        span.style.visibility = 'hidden';

        const defaultDims = {};
        for (const base of baseFonts) {
            span.style.fontFamily = base;
            body.appendChild(span);
            defaultDims[base] = { width: span.offsetWidth, height: span.offsetHeight };
            body.removeChild(span);
        }

        for (const font of fontList) {
            let detectedFont = false;
            for (const base of baseFonts) {
                span.style.fontFamily = `'${font}',${base}`;
                body.appendChild(span);
                const width = span.offsetWidth;
                const height = span.offsetHeight;
                body.removeChild(span);

                if (width !== defaultDims[base].width || height !== defaultDims[base].height) {
                    detectedFont = true;
                    break;
                }
            }
            if (detectedFont) {
                detected.push(font);
            }
        }

        return detected;
    }

    /**
     * Send the collected dataset to the target URL.
     * This method uses XMLHttpRequest to send the data as JSON.
     */
    send() {
        const xhr = new XMLHttpRequest();
        xhr.open(this.options.method, this.options.url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(this.dataset));
    }
}