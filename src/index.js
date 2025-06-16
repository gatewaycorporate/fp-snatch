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
        this.dataset["platform"] = navigator.platform;
        this.dataset["userAgent"] = navigator.userAgent;
        this.dataset["language"] = navigator.language;
        this.dataset["languages"] = navigator.languages;
        this.dataset["vendor"] = navigator.vendor;
        this.dataset["appVersion"] = navigator.appVersion;
        this.dataset["appName"] = navigator.appName;
        this.dataset["appCodeName"] = navigator.appCodeName;
        this.dataset["product"] = navigator.product;
        this.dataset["productSub"] = navigator.productSub;
        this.dataset["hardwareConcurrency"] = navigator.hardwareConcurrency;
        this.dataset["deviceMemory"] = navigator.deviceMemory;
        this.dataset["cookieEnabled"] = navigator.cookieEnabled;
        this.dataset["doNotTrack"] = navigator.doNotTrack;
        this.dataset["maxTouchPoints"] = navigator.maxTouchPoints;
        this.dataset["connection"] = navigator.connection ? {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt,
            saveData: navigator.connection.saveData
        } : null;
        this.dataset["geolocation"] = "geolocation" in navigator;
        this.dataset["mediaDevices"] = "mediaDevices" in navigator;
        this.dataset["permissions"] = "permissions" in navigator;
        this.dataset["storage"] = "storage" in navigator;
        this.dataset["serviceWorker"] = "serviceWorker" in navigator;
        this.dataset["webGL"] = (function() {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                return gl ? {
                    vendor: gl.getParameter(gl.VENDOR),
                    renderer: gl.getParameter(gl.RENDERER),
                    version: gl.getParameter(gl.VERSION),
                    shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
                } : null;
            } catch (e) {
                return null;
            }
        })();
        this.dataset["canvas"] = (function() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.fillRect(0, 0, 50, 50);
                return canvas.toDataURL();
            } catch (e) {
                return null;
            }
        })();
        this.dataset["fonts"] = (async function() {
            try {
                const fonts = await document.fonts.ready;
                return Array.from(fonts).map(font => font.family);
            } catch (e) {
                return [];
            }
        })();
        this.dataset["screen"] = {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            orientation: screen.orientation ? {
                type: screen.orientation.type,
                angle: screen.orientation.angle
            } : null
        };
        this.dataset["timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.dataset["plugins"] = Array.from(navigator.plugins).map(plugin => ({
            name: plugin.name,
            description: plugin.description,
            filename: plugin.filename,
            length: plugin.length
        }));
        this.dataset["mimeTypes"] = Array.from(navigator.mimeTypes).map(mimeType => ({
            type: mimeType.type,
            suffixes: mimeType.suffixes,
            description: mimeType.description
        }));
        this.dataset["oscpu"] = navigator.oscpu || null;
        this.dataset["audio"] = (function() {
            try {
                const audio = new Audio();
                return {
                    codecSupport: {
                        codec_wav: audio.canPlayType('audio/wav; codecs="1"'),
                        codec_mp3: audio.canPlayType('audio/mpeg; codecs="mp3"'),
                        codec_vorbis: audio.canPlayType('audio/ogg; codecs="vorbis"'),
                        codec_opus: audio.canPlayType('audio/ogg; codecs="opus"'),
                        codec_flac: audio.canPlayType('audio/ogg; codecs="flac"'),
                    },
                    sampleRate: audio.sampleRate || null
                };
            } catch (e) {
                return null;
            }
        })();
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