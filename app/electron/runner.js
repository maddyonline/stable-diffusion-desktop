var path = require("path");
var spawn = require('child_process').spawn;


const pythonBinary = `/Users/madhav/2022/maddy/stable-diffusion-experiments/stable_diffusion.openvino/.diffusion-env/bin/python`;
const pythonScript = `/Users/madhav/2022/maddy/stable-diffusion-experiments/stable_diffusion.openvino/demo.py`;
const pythonScriptArgs = ["--prompt", "rabbit in a space ship looking over the moon with aliens on the moon", "--seed", "42", "--output"];

const outputDir = "/Users/madhav/diffusion-app";
// Create a filename with a timestamp
const outputFilename = `output-${Date.now()}.png`;
// Create a full path to the output file
const outputFilepath = path.join(outputDir, outputFilename);

// append to the args
pythonScriptArgs.push(outputFilepath);

// Given string "1it [00:04,  4.81s/it]" use regex to extract the number of iterations
// and the time per iteration
// const input = "1it [00:04,  4.81s/it]";
// const regex = /(\d+)it \[(\d+):(\d+),\s+(\d+.\d+)s\/it\]/;
// const match = input.match(regex);
// const iterations = match[1];
// const minutes = match[2];
// const seconds = match[3];
// const timePerIteration = match[4];



// Run the command and stream output to console
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