const { Sequelize, DataTypes } = require('sequelize');
const path = require("path");

// define local.db in current directory
// get local directory
const db = path.join(__dirname, "local.db");


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: db,
    logging: false
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
        allowNull: false,
        defaultValue: 42
    },
    iterations: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "default"
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

async function fetchPrompts(currentPage = 0, pageSize = 2) {
    await sequelize.sync();
    const prompts = await Prompts.findAll({
        offset: currentPage * pageSize,
        limit: pageSize
    });
    return prompts;
}

async function prettyPrintPrompts(prompts) {
    for (const prompt of prompts) {
        console.log(`Prompt: ${prompt.prompt} Seed: ${prompt.seed} Key: ${prompt.key}`);
    }
}

async function testPrompts() {
    await seedPrompts();
    // Displaying each page until all prompts are displayed
    let currentPage = 0;
    let pageSize = 2;
    let prompts = await fetchPrompts(currentPage, pageSize);

    while (prompts.length > 0) {
        console.log(`Page ${currentPage + 1}`);
        prettyPrintPrompts(prompts);
        currentPage += 1;
        prompts = await fetchPrompts(currentPage, pageSize);
        console.log("-------------------");
    }
}

const api = {

    createSettings: async () => {
        await sequelize.sync();
        try {
            // create the following key-value pairs if they don't exist
            // theme: "dark"
            // language: "en"
            const kvs = [["theme", "dark"], ["language", "en"]];
            for (const [key, value] of kvs) {
                await Settings.findOrCreate({
                    where: {
                        key
                    },
                    defaults: {
                        value
                    }
                });
            }

        } catch (error) {
            console.log(error);
        }

    },
    fetchSettings: async () => {
        await sequelize.sync();
        const settings = await Settings.findAll();
        // print key value pairs
        const settingsMap = new Map();
        for (const setting of settings) {
            console.log(setting.key, setting.value);
            settingsMap.set(setting.key, setting.value);
        }
        return settingsMap;
    },

}



async function main() {
    await testPrompts();
    await api.createSettings();
    await api.fetchSettings();
}

main();