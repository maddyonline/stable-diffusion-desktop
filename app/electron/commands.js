var path = require("path");
var spawn = require('child_process').spawn;
const fs = require("fs");

async function runStableDiffusion(pythonPath, pythonScript, outputDir, { prompt, seed, iterations, key }, reportProgress) {

    // Make output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const pythonScriptArgs = [
        "--num-inference-steps", iterations,
        "--prompt", prompt, "--seed", seed, "--output"];
    const outputFilename = `im-${key}-${Date.now()}.png`;
    const outputFilepath = path.join(outputDir, outputFilename);
    pythonScriptArgs.push(outputFilepath);

    console.log("running python script with args", pythonScriptArgs);
    const cmd = spawn(pythonPath, [pythonScript, ...pythonScriptArgs]);
    cmd.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        console.log(data.toString());
    });

    // Stream stderr to console
    cmd.stderr.on('data', function (data) {
        const s = data.toString();
        console.log(`stderr: ${s}`);
        const regex = /(\d+)it \[(\d+):(\d+),\s+(\d+.\d+)s\/it\]/;
        try {

            const match = s.match(regex);
            const iterations = match[1];
            const minutes = match[2];
            const seconds = match[3];
            const timePerIteration = match[4];
            console.log(`iterations: ${iterations}, minutes: ${minutes}, seconds: ${seconds}, timePerIteration: ${timePerIteration}`);
            reportProgress({ iterations, minutes, seconds, timePerIteration });

        } catch (e) {
            // console.error(e);
        }

    });

    // In close event we are sure that stream from child process is closed
    cmd.on('close', function (code) {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
    });

    // Handle exit event
    cmd.on('exit', function (code) {
        console.log(`child process exited with code ${code}`);
    });
}

module.exports = {
    runStableDiffusion,
}