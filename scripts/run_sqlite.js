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
    await api.createSettings();
    await api.fetchSettings();
}

main();