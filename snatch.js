const targetURL = "";

const dataset = {};
dataset["platform"] = navigator.platform;
dataset["userAgent"] = navigator.userAgent;
dataset["language"] = navigator.language;
dataset["languages"] = navigator.languages;
dataset["vendor"] = navigator.vendor;
dataset["appVersion"] = navigator.appVersion;
dataset["appName"] = navigator.appName;
dataset["appCodeName"] = navigator.appCodeName;
dataset["product"] = navigator.product;
dataset["productSub"] = navigator.productSub;
dataset["hardwareConcurrency"] = navigator.hardwareConcurrency;
dataset["deviceMemory"] = navigator.deviceMemory;
dataset["cookieEnabled"] = navigator.cookieEnabled;
dataset["doNotTrack"] = navigator.doNotTrack;
dataset["maxTouchPoints"] = navigator.maxTouchPoints;
dataset["connection"] = navigator.connection ? {
    effectiveType: navigator.connection.effectiveType,
    downlink: navigator.connection.downlink,
    rtt: navigator.connection.rtt,
    saveData: navigator.connection.saveData
} : null;
dataset["geolocation"] = "geolocation" in navigator;
dataset["mediaDevices"] = "mediaDevices" in navigator;
dataset["permissions"] = "permissions" in navigator;
dataset["storage"] = "storage" in navigator;
dataset["serviceWorker"] = "serviceWorker" in navigator;
dataset["webGL"] = (function() {
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
dataset["canvas"] = (function() {
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
dataset["fonts"] = (async function() {
    try {
        const fonts = await document.fonts.ready;
        return Array.from(fonts).map(font => font.family);
    } catch (e) {
        return [];
    }
})();
dataset["screen"] = {
    width: screen.width,
    height: screen.height,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth,
    orientation: screen.orientation ? {
        type: screen.orientation.type,
        angle: screen.orientation.angle
    } : null
};
dataset["timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
dataset["plugins"] = Array.from(navigator.plugins).map(plugin => ({
    name: plugin.name,
    description: plugin.description,
    filename: plugin.filename,
    length: plugin.length
}));
dataset["mimeTypes"] = Array.from(navigator.mimeTypes).map(mimeType => ({
    type: mimeType.type,
    suffixes: mimeType.suffixes,
    description: mimeType.description
}));
dataset["oscpu"] = navigator.oscpu || null;
dataset["audio"] = (function() {
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

const xhr = new XMLHttpRequest();
xhr.open("POST", targetURL, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send(JSON.stringify(dataset));

document.dataset = dataset;