const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");
const path = require("path");
const isDevelopment = process.env.NODE_ENV === "development";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createWindow() {
    // Create a new window
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            devTools: true,
            preload: path.join(__dirname, "preload.js")
        }
    });
    // Event listeners to play music
    ipcMain.on("RUNNER", (IpcMainEvent, args) => {
        console.log("RUNNER", args);
        sleep(5000).then(() => {
            window.webContents.send("RESPONSE", { success: true });
        });
    });

    // Event listeners on the window
    window.webContents.on("did-finish-load", () => {
        window.show();
        window.focus();
    });

    // Load our HTML file
    if (isDevelopment) {
        window.loadURL("http://localhost:40992");
    } else {
        window.loadFile("app/dist/index.html");
    }
}

// This method is called when Electron
// has finished initializing
app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    } else {
        ipcMain.removeAllListeners("RUNNER");
    }
});