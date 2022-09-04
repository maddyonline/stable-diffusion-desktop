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
    ["A painting of donald trump in mona lisa style", 1, "trump"],
    ["A painting of a cat in mona lisa style", 2, "cat"],
    ["A painting of a dog in mona lisa style", 3, "dog"],
    ["A painting of a bird in mona lisa style", 4, "bird"],
    ["A painting of a fish in mona lisa style", 5, "fish"],
];

async function seedPrompts() {
    await sequelize.sync();
    for (const [prompt, seed, key] of promptsFixture) {
        // auto assign id
        await Prompts.findOrCreate({
            where: {
                prompt,
                seed,
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
    testPrompts();
    // await api.createSettings();
    // await api.fetchSettings();
}

main();