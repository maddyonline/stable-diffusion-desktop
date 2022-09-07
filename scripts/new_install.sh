#!/usr/bin/env bash

set -o xtrace



# A bash script which takes two arguments:
# 1. The path to the directory where the stable_diffusion.openvino repository will be cloned to.
# 2. The python version to be used.

# The script should:
# 1. Create the directory if it doesn't exist.
# 2. Change to the directory.
# 3. Install pyenv.
# 4. Install the specified python version.
# 5. Create a virtual environment.
# 6. Activate the virtual environment.
# 7. Clone the stable_diffusion.openvino repository.
# 8. Change to the stable_diffusion.openvino directory.
# 9. Install the requirements.

# take input args
WORKING_DIR=$1
PYTHON_VERSION=$2

# Print usage instructions if no args are passed
if [ -z "$WORKING_DIR" ] || [ -z "$PYTHON_VERSION" ]; then
  echo "Usage: $0 <working_dir> <python_version>"
  exit 1
fi

# print the input args
echo "WORKING_DIR: $WORKING_DIR"
echo "PYTHON_VERSION: $PYTHON_VERSION"

# create $WORKING_DIR if it doesn't exist
if [ ! -d "$WORKING_DIR" ]; then
  mkdir "$WORKING_DIR"
fi

# change to $WORKING_DIR
cd "$WORKING_DIR"

# create output directory if it doesn't exist
if [ ! -d "output" ]; then
  mkdir "output"
fi

# store the full path to the output directory
OUTPUT_DIR=$(pwd)/output

# print current directory
pwd

# install pyenv
brew update

# install pyenv and ignore if it is already installed

brew install pyenv || true

# check if pyenv is installed and print if is installed
if command -v pyenv &> /dev/null
then
    echo "pyenv is installed"
else
    echo "pyenv could not be installed"
    exit
fi



# install python version
command pyenv install $PYTHON_VERSION --skip-existing

# set the local python version
command pyenv local $PYTHON_VERSION

# verify the local python version
command pyenv exec python -V
command pyenv versions
command pyenv prefix

# print current directory
pwd

# create virtual environment
command pyenv exec python -m venv venv

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


python demo.py --prompt "Hand drawn sketch of donald trump in style of Picasso" --num-inference-steps 2 --seed 42 --output ${OUTPUT_DIR}/test.png
echo "Setup Successful"