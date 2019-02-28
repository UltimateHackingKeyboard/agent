module.exports = {
    "target": "electron-renderer",
    "node": {
        "fs": true,
        "global": true,
        "crypto": "empty",
        "tls": "empty",
        "net": "empty",
        "process": true,
        "module": false,
        "clearImmediate": false,
        "setImmediate": false
    }
};
