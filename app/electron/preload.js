const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    fetchPrompts: () => ipcRenderer.invoke('db:fetchPrompts'),
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