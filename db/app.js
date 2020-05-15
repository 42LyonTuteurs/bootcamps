const Discord = require('discord.js');

const client = new Discord.Client();
const { Users, Stat, Day } = require('./dbObject');
const userCtrl = require('./controllers/UsersCtrl');
const dayCtrl = require('./controllers/DayCtrl');
const statCtrl =  require('./controllers/StatCtrl');
const { Op } = require('sequelize');
// const currency = new Discord.Collection();
const PREFIX = '!';

client.once('ready', async () => {
    // const storedBalances = await Users.findAll();
    // storedBalances.forEach(b => currency.set(b.user_id, b));
    console.log(`Logged in as ${client.user.tag}!`);
    await userCtrl.printAllLogin();
});

client.on('message', async message => {
    console.log(message.content);
    if (message.content === 'add mec')
        await userCtrl.addUser("0000111", "yes man");
    if (message.content === 'print mec')
        await userCtrl.printUserInfoByLogin("yes man");
    if (message.content === 'print all')
        await userCtrl.printAllLogin();
    // if (message.content === 'day'){
    //     const user = await userCtrl.getUserByLogin('yes man');
    //     await dayCtrl.createDay(user, 0);
    // }
});

client.login('yourtoken');
