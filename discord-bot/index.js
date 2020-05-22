const Discord = require('discord.js');
const { Users, Stat, Day } = require('./dbObject');
const { Op } = require('sequelize');
const utils = require('./utils.js');
const c = require('./correction.js');
const admin = require('./administrator.js');
const configFile = require ('./config.json');
const cron = require("node-cron");
const fs = require("fs");
const config = configFile.botConfig;
const client = new Discord.Client();
var faker = require('faker');
var emoji = require('node-emoji')
const PREFIX = ':';

// Cronjobs

cron.schedule("0 42 8 25 * * ", function() {
    client.channels.cache.get(config.testChannelId).send("here is the day00 subject !\nTo install anaconda in the ex00, you have to change some lines on linux : ```1. curl -LO \"https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh\"\n" +
        "2. sh Miniconda3-latest-Linux-x86_64.sh -b -p ~/Miniconda3\n" +
        "3. conda install -y \"jupyter\" \"numpy\" \"pandas\"\n" +
        "6. which python\n```", {files: ["./day00.pdf"]});
});

cron.schedule("0 42 8 26 * * ", function() {
    client.channels.cache.get(config.testChannelId).send("here is the Day01 subject", {files: ["./day01.pdf"]});
});

cron.schedule("0 42 23 26 * * ", async function() {
    // Correction
    let LoginList = await utils.AllLogin();
    await c.correction(LoginList, 0, "374265216608763907", client);
});

cron.schedule("0 42 8 27 * * ", function() {
    client.channels.cache.get(config.testChannelId).send("here is the Day02 subject", {files: ["./day02.pdf"]});
});

cron.schedule("0 42 23 27 * * ", async function() {
    // Correction
    let LoginList = await utils.AllLogin();
    await c.correction(LoginList, 1, "374265216608763907", client);
});

cron.schedule("0 42 8 28 * * ", function() {
    client.channels.cache.get(config.testChannelId).send("here is the Day03 subject", {files: ["./day03.pdf"]});
});

cron.schedule("0 42 23 28 * * ", async function() {
    // Correction
    let LoginList = await utils.AllLogin();
    await c.correction(LoginList, 2, "374265216608763907", client);
});

cron.schedule("0 42 8 29 * * ", function() {
    client.channels.cache.get(config.testChannelId).send("here is the Day04 subject", {files: ["./day04.pdf"]});
});

cron.schedule("0 42 23 29 * * ", async function() {
    // Correction
    let LoginList = await utils.AllLogin();
    await c.correction(LoginList, 3, "374265216608763907", client);
});

cron.schedule("0 42 23 30 * * ", async function() {
    // Correction
    let LoginList = await utils.AllLogin();
    await c.correction(LoginList, 4, "374265216608763907", client);
});

// End Cronjobs

function User(id, username) {
    this.id = id;
    this.username = username;
}

async function subscribe(message, name)
{
    try {
        if (await utils.getUserByLogin(name) != null) {
            usr = await utils.getUserByLogin(name);
            if (!usr.actif)
                message.channel.send("You Gave Up !");
            else
                message.channel.send("You already subscribed !");
            return ;
        }
        let myRole = message.guild.roles.cache.get(config.bootcampRoleId);
        message.member.roles.add(myRole).catch(console.error);
        var user = new User(message.member.id, name);
        utils.logs("subscribtion of :" + user.username + " " + user.id);
        await utils.addUser(user.id, user.username);
        if (!message.guild.channels.cache.map(t => t.name).includes("bootcamp-" + name)) {
            const everyoneRole = message.guild.roles.cache.get(config.everyoneRoleId);
            const PrivateChannelWithBot = "bootcamp " + name;
            message.guild.channels.create(PrivateChannelWithBot, {
                type: "text",
                parent: config.privateChannelCategoryId,
                permissionOverwrites: [
                    {
                        id: everyoneRole,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: message.author.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                ],})
                .then(r => {
                    r.send("<@" + message.member.id + ">\n> **Here is your private channel with the bot, please enter here your commands to interract with the bot**" +
                        "\n\n__**HELP MENU**__\n\n"+
                        "You will find all the commands you can use in this discord just behind :\n\n" +
                        "**:subscribe**\n> to subscribe to the bootcamp, a private channel will be created\n\n" +
                        "**:info**\n> to diplay info from yourself or from other participant with *:info <login>*\n\n" +
                        "**:validates <login> <day> <validated/notvalidated>**\n> to tell the bot that you corrected the <day> of <login> and if the day is <validated> or <notvalidated>\n\n" +
                        "**:corrected by <login> <day>**\n> to tell the bot that your <day> have been corrected by <login>\n\n" +
                        "**:unsubscribe**\n> __**THIS COMMAND IS A DEFINITIVE UNSUBSCRIPTION FROM THE BOOTCAMP**__\n\n" +
                        "\n__**:help**__ to to diplay all the commands you can use !"
                    );
                })
                .catch(console.error);
        }
        message.channel.send("```" + name + " has been successfully subscribed !\nA Channel has just been created for you in Bootcamp " +
            "category\nPlease write your commands there to interact with the bot\nThis message will self-destroyed in 10s```")
            .then(msg => {
                msg.delete({ timeout: 15000 })
            });
    } catch (e) {
        utils.logs("ERROR : subscription failed : " + e);
        message.channel.send("ERROR : subscription failed : " + e);
    }
};

async function unsubscribe(message, name)
{
    // await utils.deleteUserByLogin(name);
    await utils.updateUserAtivity(await utils.getUserByLogin(name));
    let channelToDestroy;
    if (message.guild.channels.cache.map(t => t.name).includes("bootcamp-" + name)) {
        message.guild.channels.cache.forEach(element => {
            if (element.name === "bootcamp-" + name)
                channelToDestroy = element;
        });
    }
    channelToDestroy.delete();
    message.channel.send("You succesfully unsubscribed !");
}

async function list(message, name, discord_id, commandArgs)
{
    if (utils.isAdmin(discord_id))
    {
        if (commandArgs === "all")
            await utils.printAllAllActivity(message);
        else
            await utils.printAll(message);
    }
    else
        utils.logs("You should be admin to this");
}

async function status(message, argv, name, discord_id)
{
    let LoginList = await utils.AllLoginAllActivity();
    if (!utils.isAdmin(discord_id)){
        help(message);
        return;
    }
    if (!argv[0])
        utils.printUserInfoByLoginInChannel(message, name)
    else {
        argv.forEach(element => {
            if (LoginList.includes(element))
                utils.printUserInfoByLoginInChannel(message, element);
            else
                message.channel.send("```Could not find user with " + element + " username```");
        })
    }
}

async function info(message, argv, name)
{
    let LoginList = await utils.AllLogin();
    if (!argv[0])
        utils.printInfo(message, name)
    else {
        argv.forEach(element => {
            if (LoginList.includes(element))
                utils.printInfo(message, element);
            else
                message.channel.send("```Could not find user with " + element + " username```");
        })
    }
}

function help(message)
{
    let str = "__**HELP MENU**__\n\n"+
        "You will find all the commands you can use in this discord just behind :\n\n" +
        "**:subscribe**\n> to subscribe to the bootcamp, a private channel will be created\n\n" +
        "**:info**\n> to diplay info from yourself or from other participant with *:info <login>*\n\n" +
        "**:validates <login> <day> <validated/notvalidated>**\n> to tell the bot that you corrected the <day> of <login> and if the day is <validated> or <notvalidated>\n\n" +
        "**:corrected by <login> <day>**\n> to tell the bot that your <day> have been corrected by <login>\n\n" +
        "**:unsubscribe**\n> __**THIS COMMAND IS A DEFINITIVE UNSUBSCRIPTION FROM THE BOOTCAMP**__\n\n"
    ;
    message.channel.send(str);
}

async function adminHelp(message){
    let str = "__**HELP ADMIN MENU**__\n\n"+
        "You will find all the commands you can use in this discord just behind :\n\n" +
        "**:admin dayCorrection <login> <day>**\n> set day correction = 2 \n\n" +
        "**:admin dayCorrected <login> <day>**\n> set day corrected = 2 \n\n" +
        "**:admin dayValidated <login> <day>**\n> set day validated = 2 \n\n" +
        "**:admin dayComplete <login> <day>**\n> set day complete = 2 \n\n" +
        "**:admin statCorrection <login>**\n> set stat correction = +1 \n\n" +
        "**:admin statCorrected <login>**\n> set stat corrected = +1\n\n" +
        "**:admin statDaysDone <login>**\n> set stat days done = +1 \n\n";
    message.channel.send(str);
}

async function force(message, argv, name, discord_id){
    if (utils.isAdmin(discord_id))
    {
        const login = argv[1];
        const nbDay = argv[2];
        if (login === undefined){
            await adminHelp(message);
            return (0);
        }
        if (argv[0] === 'dayCorrection'){
            if (nbDay === undefined)
                await adminHelp(message);
            await admin.forceCorrectionDone(login, nbDay);
        }
        else if (argv[0] === 'dayCorrected'){
            if (nbDay === undefined)
                await adminHelp(message);
            await admin.forceCorrectedDone(login, nbDay);
        }
        else if (argv[0] === 'dayValidated'){
            if (nbDay === undefined)
                await adminHelp(message);
            await admin.forceDayValidated(login, nbDay);
        }
        else if (argv[0] === 'dayComplete'){
            if (nbDay === undefined)
                await adminHelp(message);
            await admin.forceDayComplete(login, nbDay);
        }
        else if (argv[0] === 'statCorrection'){
            await admin.forceSetStatCorrection(login);
        }
        else if (argv[0] === 'statCorrected'){
            await admin.forceSetStatCorrected(login);
        }
        else if (argv[0] === 'statDaysDone'){
            await admin.forceSetStatDaysDone(login);
        }
        else
            await adminHelp(message);
    }
    else
        help(message);
}

client.on('ready', async() => {
    fs.writeFile('app.log', "", (err) => {
        if (err) throw err;
    })
    console.log(`Logged in as ${client.user.tag}!`);
    utils.logs(`Logged in as ${client.user.tag}!`);

});

client.on('message', async message => {
    if (message.author.username != "bootcamp" && !message.author.bot && message.content.search("!mana") == -1 && message.content.startsWith(PREFIX))
    {
        // console.log(message.guild.channels.cache)
        if (!message.member) {
            message.author.send('```DM disable, please call me from 42 Lyon Server```')
            return;
        }
        if (message.content.length > 100){
            message.channel.send("NOPE");
            return ;
        }
        let LoginList = await utils.AllLogin();
        let name = message.member.nickname == null ? message.author.username : message.member.nickname;
        let discord_id = message.member.id;
        if (message.content !== ":help" && message.content !== ":subscribe" && !LoginList.includes(name)) {
            message.channel.send("Please !subscribe to access the commands")
            return ;
        }
        utils.logs(message.content, name);
        client.emit('checkMessage', message);
        const input = message.content.slice(PREFIX.length).split(' ');
        const command = input.shift();
        const commandArgs = input.join(' ');
        if (command === 'subscribe')
            subscribe(message, name);
        else if (command === 'info')
            info(message, commandArgs.split(" "), name);
        else if (command === 'status')
            status(message, commandArgs.split(" "), name, discord_id);
        else if (command === 'unsubscribe')
            unsubscribe(message, name);
        // else if (command === 'setCorrection')
        //     setCorrection(message, name);
        else if (command === 'list')
            list(message, name, discord_id, commandArgs);
            // else if (command === 'setDay'){
            //   const usr = await utils.getUserByLogin("jdarko")
            //   // const usr2 = await utils.getUserByLogin("")
            //   await utils.createDay(usr, 0);
            //   await utils.createDay(usr, 1);
        // }
        else if (command === 'correction')
        {
            let error = await c.correction(LoginList, commandArgs, discord_id, client);
            if (error == 1){
                help(message);
            }
        }
        else if (command === 'admin')
            force(message, commandArgs.split(" "), name, discord_id);
        else if (command === 'corrected'){
            if (await c.corrected(message, commandArgs.split(" "), name) == 1)
                help(message);
        }
        else if (command === 'validates'){
            if (await c.validated(message, commandArgs.split(" "), name) == 1)
                help(message);
        }
        else if (command === 'help')
            help(message);
        else {
            message.channel.send("```" + message.content + " is an unknown function, please try !help```")
                .then(msg => {
                    msg.delete({timeout: 10000})
                });
        }
    }
});

client.login(config.token);
