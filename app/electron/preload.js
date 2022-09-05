const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    // invoke functions (synchronous)
    fetchPrompts: () => ipcRenderer.invoke('db:fetchPrompts'),
    createPrompt: ({ prompt, seed, key }) => ipcRenderer.invoke('db:createPrompt', { prompt, seed, key }),
    fetchImages: () => ipcRenderer.invoke('fs:fetchImages'),
    // fire and forget functions (Renderer -> Main)
    run: (name) => ipcRenderer.send('run-channel', name),
    // listen for events (Main -> Renderer)
    listenForProgress: (callback) => {
        const handler = (_event, ...args) => callback(...args);
        ipcRenderer.on("progress-channel", handler);
        return () => {
            console.log("removing listener")
            ipcRenderer.removeListener("progress-channel", handler);
        }
    }, 
});