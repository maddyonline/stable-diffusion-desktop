#!/usr/bin/env bash

set -o xtrace


WORKING_DIR=diffusion-app
PYTHON_DIR=python-dir

# create $HOME/$WORKING_DIR if it doesn't exist
if [ ! -d "$HOME/$WORKING_DIR" ]; then
  mkdir "$HOME/$WORKING_DIR"
fi

# create $HOME/$WORKING_DIR/$PYTHON_DIR if it doesn't exist
if [ ! -d "$HOME/$WORKING_DIR/$PYTHON_DIR" ]; then
  mkdir "$HOME/$WORKING_DIR/$PYTHON_DIR"
fi

# change to $HOME/$WORKING_DIR/$PYTHON_DIR
cd "$HOME/$WORKING_DIR/$PYTHON_DIR"

# print current directory
pwd

brew update

# install pyenv and ignore if it is already installed

brew install pyenv || true

echo "done installing pyenv"

command pyenv install 3.8.10 --skip-existing 
command pyenv local 3.8.10
command pyenv local

eval "$(command pyenv init --path)"

command pyenv shell 3.8.10

# list all files including hidden files
ls -a

# create virtual environment
python -m venv venv

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

# run demo.py with following args: ["--prompt", "Hand drawn sketch of donald trump in style of Picasso", "--seed", "42", "--output", "/Users/madhav/diffusion-app/output.png"]
python demo.py --prompt "Hand drawn sketch of donald trump in style of Picasso" --seed 42 --output output.png


