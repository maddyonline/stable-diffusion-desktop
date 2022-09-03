const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    run: function (name) {
        ipcRenderer.send("RUNNER", {
            name
        });
    },
});