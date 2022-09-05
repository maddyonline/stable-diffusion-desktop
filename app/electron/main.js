const {
    app,
    BrowserWindow,
    ipcMain,
    shell
} = require("electron");
const path = require("path");
const { fetchPrompts, fetchSettings, createPrompt, seedPrompts, seedSettings } = require("./db.js");

const fs = require("fs");

const { getWorkDir, getDBPath, getLogPath } = require("./utils.js");
const { runStableDiffusion } = require("./commands.js");




function createWorkDir() {
    const workDir = getWorkDir();
    // Check if the directory exists
    if (!fs.existsSync(workDir)) {
        // If not, create it
        fs.mkdirSync(workDir);
    }
    // Create a sqlite database file if it doesn't exist
    const dbFile = getDBPath();
    if (!fs.existsSync(dbFile)) {
        fs.closeSync(fs.openSync(dbFile, "w"));
    }
    // Create a log file if it doesn't exist
    const logFile = getLogPath();
    if (!fs.existsSync(logFile)) {
        fs.closeSync(fs.openSync(logFile, "w"));
    }
    seedPrompts();
    seedSettings();
}

const isDevelopment = process.env.NODE_ENV === "development";

async function fetchImages() {

    const workDir = getWorkDir();
    // return top 10 images in the work directory based on their modification time
    const images = await fs.promises.readdir(workDir, { withFileTypes: true });
    const imageFiles = images.filter((image) => image.isFile()).map((image) => image.name);
    // keep only png files
    const pngFiles = imageFiles.filter((image) => image.endsWith(".png"));
    // sort by modification time
    const sortedFiles = pngFiles.sort((a, b) => {
        const aTime = fs.statSync(path.join(workDir, a)).mtime;
        const bTime = fs.statSync(path.join(workDir, b)).mtime;
        return bTime - aTime;
    });
    // keep top 5 files
    const topFiles = sortedFiles.slice(0, 5);
    // return base64 encoded images
    const base64Images = topFiles.map((image) => {
        const imageFile = fs.readFileSync(path.join(workDir, image));
        return imageFile.toString("base64");
    });
    return base64Images;
}

function createWindow() {
    // Create a new window
    const window = new BrowserWindow({
        width: 1200,
        height: 900,
        show: false,
        webPreferences: {
            devTools: true,
            preload: path.join(__dirname, "preload.js")
        }
    });
    createWorkDir();
    ipcMain.handle('db:fetchPrompts', async () => await fetchPrompts());
    ipcMain.handle('db:fetchSettings', async () => await fetchSettings());
    ipcMain.handle('db:createPrompt', async (_event, payload) => await createPrompt(payload));
    ipcMain.handle('fs:fetchImages', async () => await fetchImages());
    ipcMain.handle('sh:openFolder', () => shell.openPath(app.getPath("home")));



    ipcMain.on("run-channel", (_event, args) => {
        console.log("run-channel", args);
        runStableDiffusion(args, (progress) => {
            window.webContents.send("progress-channel", { args: args, progress: progress });
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