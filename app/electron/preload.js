const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    run: function (name) {
        ipcRenderer.send("RUNNER", {
            name
        });
    },
    listenFromMain: function (callback) {
        ipcRenderer.on("RESPONSE", (event, args) => {
            callback(args);
        });
    }
});