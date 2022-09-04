const { Sequelize, Model, DataTypes } = require('sequelize');
const { WORK_DIR, DB_NAME } = require("./constants.js");
const {
    app,
} = require("electron");
const path = require("path");


// const db = path.join(app.getPath("home"), WORK_DIR, DB_NAME);
const db = `/Users/madhav/2022/maddy/stable-diffusion-experiments/stable-diffusion-desktop/scripts/local.db`;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: db
});

// Define a model for storing global settings

const Settings = sequelize.define('Settings', {
    // Model attributes are defined here
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


// Define a model for storing user prompts with the following columns: [id, prompt, seed, key]

const Prompts = sequelize.define('Prompts', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    prompt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    seed: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
    }
});



module.exports = {
    fetchPrompts: async () => {
        const prompts = await Prompts.findAll();
        // convert to an array of objects
        return prompts.map(prompt => prompt.dataValues);
    }
}
