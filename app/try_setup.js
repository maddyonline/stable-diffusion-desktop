const path = require("path");

const { setupWorkDir } = require("./electron/setuputils.js");
const { runSetup } = require("./electron/commands.js");

const workDir = `local-work-dir`;

async function main() {
    const setupScriptPath = path.join(workDir, "setup.sh");
    console.log("Creating and saving setup script to", setupScriptPath);
    await setupWorkDir(workDir);
    console.log("Running script saved here: ", setupScriptPath);
    runSetup(setupScriptPath, (progress) => {
        // console.log(progress);
    });

}

main();