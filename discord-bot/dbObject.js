const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const Users = sequelize.import('models/Users');
const Day = sequelize.import('models/Day');
const Stat =  sequelize.import('models/Stat');
const Correc =  sequelize.import('models/Correc');

module.exports = { Users, Day, Stat, Correc, sequelize };
