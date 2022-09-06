const { Sequelize, DataTypes } = require('sequelize');
const { getDBPath, getPythonPath, getPythonScript } = require("./utils.js");


const db = getDBPath();

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


const promptsFixture = [
    ["pikachu as a realistic fantasy knight, closeup portrait art", "pikachu"],
    ["Baroque oil painting rick sanchez from rick and morty illustration concept art", "rick"],
    ["Winnie the pooh practicing karate at the shaolin temple", "winnie"],
    ["Super mario by greg rutkowski, sung choi, mitchell mohrhauser", "mario"],
    ["A painting of trump in mona lisa style", "trump"],
];

async function seedPrompts() {
    await sequelize.sync();
    for (const [prompt, key] of promptsFixture) {
        // auto assign id
        await Prompts.findOrCreate({
            where: {
                prompt,
                key
            }
        });
    }
}



const settingsFixture = [
    ["theme", "dark"],
    ["language", "en"],
    ["pythonPath", getPythonPath()],
    ["pythonScript", getPythonScript()],
];

async function seedSettings(force = false) {
    await sequelize.sync();
    if (force) {
        // force update settings based on settingsFixture
        for (const [key, value] of settingsFixture) {
            await Settings.upsert({
                key,
                value
            });
        }
    }
    // if key does not exist, create it with the default value above
    for (const [key, value] of settingsFixture) {
        await Settings.findOrCreate({
            where: {
                key
            },
            defaults: {
                value
            }
        });
    }
}

module.exports = {
    fetchPrompts: async () => {
        // fetch prompts reverse sorted by creation time
        const prompts = await Prompts.findAll({
            order: [
                ['id', 'DESC']
            ]
        });
        return prompts.map(prompt => prompt.dataValues);
    },
    createPrompt: async (payload) => {
        console.log(`creating with following payload`, payload);
        await Prompts.create(payload);
    },
    fetchSettings: async () => {
        const settings = await Settings.findAll();
        return settings.map(setting => setting.dataValues);
    },
    fetchSettingsValue: async (key) => {
        // Since key is the primary key, we return the unique value corresponding to the key
        const setting = await Settings.findOne({
            where: {
                key
            }
        });
        return setting.dataValues.value;
    },
    updateSettings: async ({ key, value }) => {
        // Since key is the primary key, we update the unique value corresponding to the key
        await Settings.update({
            value
        }, {
            where: {
                key
            }
        });

    },
    seedPrompts,
    seedSettings,
}
