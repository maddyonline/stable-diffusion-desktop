const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');
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
    createUser: async () => {
        await sequelize.sync();
        const jane = await User.create({
            username: 'janedoe',
            birthday: new Date(1980, 6, 20)
        });
        console.log(jane.toJSON());
    }
}
