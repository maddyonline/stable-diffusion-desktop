const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
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