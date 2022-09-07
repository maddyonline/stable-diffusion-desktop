const setupScript = (workingDir, outputDir) => `
#!/usr/bin/env bash

set -o xtrace

PYTHON_VERSION=3.8.10
WORKING_DIR=${workingDir}
PYTHON_DIR=python-dir

# create $WORKING_DIR if it doesn't exist
if [ ! -d "$WORKING_DIR" ]; then
  mkdir "$WORKING_DIR"
fi

# create $WORKING_DIR/$PYTHON_DIR if it doesn't exist
if [ ! -d "$WORKING_DIR/$PYTHON_DIR" ]; then
  mkdir "$WORKING_DIR/$PYTHON_DIR"
fi

# change to $WORKING_DIR/$PYTHON_DIR
cd "$WORKING_DIR/$PYTHON_DIR"

# print current directory
pwd

/usr/local/bin/brew update

/usr/local/bin/brew install pyenv || true



/usr/local/bin/pyenv --version

/usr/local/bin/pyenv install $PYTHON_VERSION --skip-existing 

# set the local python version
/usr/local/bin/pyenv local $PYTHON_VERSION

# verify the local python version
/usr/local/bin/pyenv exec python -V
/usr/local/bin/pyenv versions
/usr/local/bin/pyenv prefix

# print current directory
pwd

# create virtual environment
/usr/local/bin/pyenv exec python -m venv venv

# activate virtual environment
source venv/bin/activate

# print which python is being used
which python

# print python version
python --version

#  remove stable_diffusion.openvino directory if it exists
if [ -d "stable_diffusion.openvino" ]; then
  rm -rf stable_diffusion.openvino
fi

git clone https://github.com/maddyonline/stable_diffusion.openvino.git

# change to stable_diffusion.openvino directory and install requirements
cd stable_diffusion.openvino

which pip
pip install --upgrade pip
pip install -r requirements.txt

python demo.py --prompt "Hand drawn sketch of donald trump in style of Picasso" --num-inference-steps 2 --seed 42 --output ${outputDir}/test.png
echo "Setup Successful"
`

module.exports = {
    setupScript,
}