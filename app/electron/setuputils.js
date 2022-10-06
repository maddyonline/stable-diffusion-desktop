const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

const { setupScript } = require("./setup.js");

async function setupWorkDir(workDir) {
    const IMG_URL = "https://upload.wikimedia.org/wikipedia/commons/3/32/A_photograph_of_an_astronaut_riding_a_horse_2022-08-28.png";
    const outputDir = path.join(workDir, "output");
    const logsDir = path.join(workDir, "logs");

    // create outputDir and logsDir if they don't exist (recursively)
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
    // write IMG_URL to outputDir
    const imageFile = await fetch(IMG_URL);
    const imageBuffer = await imageFile.buffer();
    fs.writeFileSync(path.join(outputDir, "astronaut.png"), imageBuffer);


    // Write setup script to the work directory
    const setupScriptPath = path.join(workDir, "setup.sh");
    // write script to the file with executable permissions
    fs.writeFileSync(setupScriptPath, setupScript(workDir, outputDir), { mode: 0o755 });

}

module.exports = {
    setupWorkDir,
};