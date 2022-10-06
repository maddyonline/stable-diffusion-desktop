const app = require("electron").app;
const path = require("path");

const { WORK_DIR, DB_NAME } = require("./constants.js");

const getWorkDir = () => path.join(app.getPath("home"), WORK_DIR);
const getDBPath = () => path.join(getWorkDir(), DB_NAME);
const getLogPath = () => path.join(getWorkDir(), "log.txt");

const pythonPath = ["python-dir", "venv", "bin", "python"]
const pythonScript = ["python-dir", "stable_diffusion.openvino", "demo.py"]

const getPythonPath = () => path.join(getWorkDir(), ...pythonPath);
const getPythonScript = () => path.join(getWorkDir(), ...pythonScript);



module.exports = {
    getWorkDir,
    getDBPath,
    getLogPath,
    getPythonPath,
    getPythonScript,
}