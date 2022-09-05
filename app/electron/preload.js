const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    fetchPrompts: () => ipcRenderer.invoke('db:fetchPrompts',),
    createPrompt: ({ prompt, seed, key }) => ipcRenderer.invoke('db:createPrompt', { prompt, seed, key }),
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