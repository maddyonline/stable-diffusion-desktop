const { Sequelize, Model, DataTypes } = require('sequelize');
const { WORK_DIR, DB_NAME } = require("./constants.js");
const {
    app,
} = require("electron");
const path = require("path");


const db = path.join(app.getPath("home"), WORK_DIR, DB_NAME);

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




const User = sequelize.define('User', {
    username: DataTypes.STRING,
    birthday: DataTypes.DATE,
});


module.exports = {
    queryUsers: async () => {
        await sequelize.sync();
        const users = await User.findAll();
        console.log(users);
    },
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
    createUser: async () => {
        await sequelize.sync();
        const jane = await User.create({
            username: 'janedoe',
            birthday: new Date(1980, 6, 20)
        });
        console.log(jane.toJSON());
    }
}
