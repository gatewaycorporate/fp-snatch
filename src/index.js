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

        // Collect High Entropy Values
        navigator.userAgentData.getHighEntropyValues([
            "architecture",
            "model",
            "platform",
            "platformVersion",
            "uaFullVersion",
            "bitness"
        ]).then(function(highEntropyValues) {
            this.dataset.highEntropyValues = highEntropyValues;
        });
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