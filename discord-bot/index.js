const Discord = require('discord.js');
const { Users, Stat, Day } = require('./dbObject');
const { Op } = require('sequelize');
const utils = require('./utils.js');
const c = require('./correction.js');
const configFile = require ('./config.json');
const cron = require("node-cron");
const fs = require("fs");
const config = configFile.botConfig;
const client = new Discord.Client();
var faker = require('faker');
var users = new Array();
const PREFIX = '!';

// Cronjobs

cron.schedule("42 8 16 * * ", function() {
    client.channels.cache.get(config.testChannelId).send("here is the first test", {files: ["./day00.pdf"]});
});

cron.schedule("42 8 18 * * ", function() {
    client.channels.cache.get(config.testChannelId).send("here is the first subject", {files: ["./day00.pdf"]});
});

cron.schedule("42 8 19 * * ", function() {
    client.channels.cache.get(config.testChannelId).send("here is the first subject", {files: ["./day01.pdf"]});
});

cron.schedule("42 8 20 * * ", function() {
    client.channels.cache.get(config.testChannelId).send("here is the first subject", {files: ["./day02.pdf"]});
});

cron.schedule("42 8 21 * * ", function() {
    client.channels.cache.get(config.testChannelId).send("here is the first subject", {files: ["./day03.pdf"]});
});

cron.schedule("42 8 22 * * ", function() {
    client.channels.cache.get(config.testChannelId).send("here is the first subject", {files: ["./day04.pdf"]});
});

// End Cronjobs

function User(id, username) {
    this.id = id;
    this.username = username;
}

async function subscribe(message)
{
    let myRole = message.guild.roles.cache.get(config.bootcampRoleId);
    message.member.roles.add(myRole).catch(console.error);
    var user = new User(message.author.id, message.author.username);
    utils.logs("subscribtion of :" + user.username + " " + user.id);
    users.push(user);
    await utils.addUser(user.id, user.username);
};

async function unsubscribe(message)
{
    await utils.deleteUserByLogin(message.author.username)
    let index = users.findIndex(u => u.username == message.author.username);
    if (index != -1)
        users.splice(index, 1);
}

async function list(message)
{
    if (utils.isAdmin(message.author))
    {
        await utils.All();
    }
    else
        utils.logs("You should be admin to this");
}

function info(message, argv)
{
    if (!argv)
    {
        printUser.InfoByLogin(message.author.username)
    }
}

function help(message)
{
    message.channel.send("!help");
}

async function fakerDb()
{
    for (let i = 0; i < 10; i++)
    {
        var user = new User(faker.finance.account(18), faker.name.firstName());
        await utils.addUser(user.id, user.username);
        users.push(user);
    }
}

async function setDay(message){
    if (utils.isAdmin(message.author))
    {
        let user = await utils.getUserByLogin(message.author.username);
        await utils.createDay(user, 0);
    }
    else
        utils.logs("You should be admin to this");
    const stat = await utils.getStatByLogin(message.author.username);
    const dayId = await utils.getDayIdByStat(stat, 0);
}

client.on('ready', async() => {
    await fakerDb();
    fs.writeFile('app.log', "", (err) => {
        if (err) throw err;
    })
    console.log(`Logged in as ${client.user.tag}!`);
    utils.logs(`Logged in as ${client.user.tag}!`);

});

client.on('message', message => {
    utils.logs("send : "+ message.content, message.author);
    if (message.author.username != "bootcamp" && message.author.username != "Rythm")
    {
        if (message.content.startsWith(PREFIX))
        {
            const input = message.content.slice(PREFIX.length).split(' ');
            const command = input.shift();
            const commandArgs = input.join(' ');
            console.log(commandArgs);
            if (command === 'subscribe')
                subscribe(message);
            else if (command === 'info')
                info(message, commandArgs);
            else if (command === 'unsubscribe')
                unsubscribe(message);
            else if (command === 'setCorrection')
                setCorrection(message);
            else if (command === 'list')
                list(message);
            else if (command === 'correction')
                c.correction(users);
            else if (command === 'setDay')
                setDay(message);
            else
                help(message);
        }
    }
});

client.login(config.token);
