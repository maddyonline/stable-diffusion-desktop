var path = require("path");
var spawn = require('child_process').spawn;
const fs = require("fs");

async function runSetup(scriptPath, reportProgress) {
    console.log("running setup script", scriptPath);
    const cmd = spawn("bash", [scriptPath]);
    // create a logs folder next to scriptPath
    const logsDir = path.join(path.dirname(scriptPath), "logs");
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }
    // tee log files
    const stdoutLogStream = fs.createWriteStream(path.join(logsDir, "setup.stdout.log"));
    const stderrLogStream = fs.createWriteStream(path.join(logsDir, "setup.stderr.log"));

    cmd.stdout.pipe(stdoutLogStream);
    cmd.stderr.pipe(stderrLogStream);

    cmd.stdout.on('data', function (data) {
        console.log('Pipe data from setup script ...');
        console.log(data.toString());
        reportProgress({ "stdout": data.toString() });
    });

    // Stream stderr to console
    cmd.stderr.on('data', function (data) {
        console.log(`stderr: ${data.toString()}`);
        reportProgress({ "stderr": data.toString() });
    });

    // In close event we are sure that stream from child process is closed
    cmd.on('close', function (code) {
        console.log(`child process close all stdio with code ${code}`);
        reportProgress({ "close": code });
        // send data to browser
    });

    // Handle exit event
    cmd.on('exit', function (code) {
        console.log(`child process exited with code ${code}`);
        reportProgress({ "exit": code });
    });
}

async function runStableDiffusion(pythonPath, pythonScript, outputDir, logsDir, { prompt, seed, iterations, key }, reportProgress) {

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

    // use the same log name as the output file except with .log extension
    // seprate files for stdout and stderr
    const stdoutLogFilename = outputFilename.replace(".png", ".stdout.log");
    const stderrLogFilename = outputFilename.replace(".png", ".stderr.log");

    console.log("running python script with args", pythonScriptArgs);
    const cmd = spawn(pythonPath, [pythonScript, ...pythonScriptArgs]);

    // tee log files
    const stdoutLogStream = fs.createWriteStream(path.join(logsDir, stdoutLogFilename));
    const stderrLogStream = fs.createWriteStream(path.join(logsDir, stderrLogFilename));

    cmd.stdout.pipe(stdoutLogStream);
    cmd.stderr.pipe(stderrLogStream);



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
    runSetup,
    runStableDiffusion,
}