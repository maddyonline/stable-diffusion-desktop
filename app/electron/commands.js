var path = require("path");
var spawn = require('child_process').spawn;

async function runStableDiffusion({ prompt, seed, iterations, key }, reportProgress) {
    const pythonBinary = `/Users/madhav/2022/maddy/stable-diffusion-experiments/stable_diffusion.openvino/.diffusion-env/bin/python`;
    const pythonScript = `/Users/madhav/2022/maddy/stable-diffusion-experiments/stable_diffusion.openvino/demo.py`;
    const outputDir = "/Users/madhav/diffusion-app";
    const pythonScriptArgs = [
        "--num-inference-steps", iterations,
        "--prompt", prompt, "--seed", seed, "--output"];
    const outputFilename = `im-${key}-${Date.now()}.png`;
    const outputFilepath = path.join(outputDir, outputFilename);
    pythonScriptArgs.push(outputFilepath);

    console.log("running python script with args", pythonScriptArgs);
    const cmd = spawn(pythonBinary, [pythonScript, ...pythonScriptArgs]);
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