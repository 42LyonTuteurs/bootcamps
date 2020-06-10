const utils = require('./utils.js');
const c = require('./correction.js');
const i = require('./index');

function User(id, username) {
    this.id = id;
    this.username = username;
}

async function createChan(client, name, faker) {
    const guild = client.guilds.cache.find(guild => guild.name === i.config.ServerName);
    const everyoneRole = guild.roles.cache.get(i.config.everyoneRoleId);
    const PrivateChannelWithBot = "bootcamp " + name;
    let LoginList = await utils.AllLogin();
    let userNb = LoginList.length;
    var user = await utils.getUserByLogin(name)
    if (faker)
        discord_id = i.botConfig.admin[0];
    else
        discord_id = user.discord_id;
    guild.channels.create(PrivateChannelWithBot, {
        type: "text",
        parent: guild.channels.cache.find(chan => chan.name == "BOOTCAMP" + [Math.trunc(1 + userNb / 50)]),
        permissionOverwrites: [
            {
                id: everyoneRole,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: discord_id,
                allow: ['VIEW_CHANNEL'],
            },
        ],
    })
        .then(r => {
            r.send("<@" + user.discord_id + ">\n> **Here is your private channel with the bot, please enter here your commands to interract with the bot**" +
                "\n\n__**HELP MENU**__\n\n" +
                "You will find all the commands you can use in this discord just behind :\n\n" +
                "**" + i.PREFIX + "subscribe**\n> to subscribe to the bootcamp, a private channel will be created\n\n" +
                "**" + i.PREFIX + "info**\n> to diplay info from yourself or from other participant with *:info <login>*\n\n" +
                "**" + i.PREFIX + "validates <login> <day> <validated/notvalidated>**\n> to tell the bot that you corrected the <day> of <login> and if the day is <validated> or <notvalidated>\n\n" +
                "**" + i.PREFIX + "corrected by <login> <day>**\n> to tell the bot that your <day> have been corrected by <login>\n\n" +
                "**" + i.PREFIX + "unsubscribe**\n> __**THIS COMMAND IS A DEFINITIVE UNSUBSCRIPTION FROM THE BOOTCAMP**__\n\n" +
                "\n__**" + i.PREFIX + "help**__ to to diplay all the commands you can use !"
            );
        })
        .catch(console.error);
}

async function subscribe(client, name, message)
{
    let nbCur = 0;
    message.guild.channels.cache.forEach(element => {
        if (element.name.startsWith("bootcamp-") === true)
            nbCur++;
    })
    i.logs(`There is ${nbCur} channel for the bootcamp at the moment.`);
    let usr;
    try {
        if (await utils.getUserByLogin(name) != null) {
            usr = await utils.getUserByLogin(name);
            if (!usr.actif)
                message.channel.send("You Gave Up !");
            else
                message.channel.send("You already subscribed !");
            return;
        }
        let myRole = message.guild.roles.cache.get(i.config.bootcampRoleId);
        message.member.roles.add(myRole).catch(console.error);
        var user = new User(message.member.id, name);
        i.logs("subscription of :" + user.username + " " + user.id);
        await utils.addUser(user.id, user.username);
        if (!message.guild.channels.cache.map(t => t.name).includes("bootcamp-" + name)) {
            createChan(client, name, 0)
        }
        message.channel.send("```" + name + " has been successfully subscribed !\nA Channel has just been created for you in Bootcamp " +
            "category\nPlease write your commands there to interact with the bot\nThis message will self-destroyed in 10s```")
            .then(msg => {
                msg.delete({timeout: 15000})
            });
    } catch (e) {
        i.logs("ERROR : subscription failed : " + e);
        message.channel.send("ERROR : subscription failed : " + e);
    }
};

async function unsubscribe(message, name)
{
    // await utils.deleteUserByLogin(name);
    await utils.userGiveUpActivity(await utils.getUserByLogin(name));
    message.guild.channels.cache.forEach(element => {
        if (element.name === "bootcamp-" + name.toLowerCase())
            element.delete();
    });
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
        help(message);
}

async function status(message, argv, name, discord_id)
{
    let LoginList = await utils.AllLoginAllActivity();
    if (!utils.isAdmin(discord_id)){
        help(message);
        return;
    }
    if (!argv[0])
        await utils.printUserInfoByLoginInChannel(message, name)
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
        "**" + PREFIX + "subscribe**\n> to subscribe to the bootcamp, a private channel will be created\n\n" +
        "**" + PREFIX + "info**\n> to diplay info from yourself or from other participant with *:info <login>*\n\n" +
        "**" + PREFIX + "validates <login> <day> <validated/notvalidated>**\n> to tell the bot that you corrected the <day> of <login> and if the day is <validated> or <notvalidated>\n\n" +
        "**" + PREFIX + "corrected by <login> <day>**\n> to tell the bot that your <day> have been corrected by <login>\n\n" +
        "**" + PREFIX + "unsubscribe**\n> __**THIS COMMAND IS A DEFINITIVE UNSUBSCRIPTION FROM THE BOOTCAMP**__\n\n"
    ;
    message.channel.send(str);
}

async function userCommands(command, message, commandArgs, name, discord_id, client) {
    let LoginList = await utils.AllLogin();
    if (command === 'subscribe')
        subscribe(client, name, message);
    else if (command === 'info')
        info(message, commandArgs.split(" "), name);
    else if (command === 'status')
        status(message, commandArgs.split(" "), name, discord_id);
    else if (command === 'unsubscribe')
        unsubscribe(message, name);
    else if (command === 'list')
        list(message, name, discord_id, commandArgs);
    else if (command === 'finish')
        c.setDayAsFinished(message, name, discord_id, commandArgs.split(" "));
    else if (command === 'correction') {
        let error = await c.correction(LoginList, commandArgs, discord_id, client);
        if (error == 1) {
            help(message);
        }
    } else if (command === 'corrected') {
        if (await c.corrected(message, commandArgs.split(" "), name) === 1)
            help(message);
    } else if (command === 'validates') {
        if (await c.validated(message, commandArgs.split(" "), name) === 1)
            help(message);
    } else if (command === 'help')
        help(message);
    else {
        message.channel.send("```" + message.content + " is an unknown function, please try " + PREFIX + "help```")
            .then(msg => {
                msg.delete({timeout: 10000})
            });
    }
}

module.exports.userCommands = userCommands;
module.exports.createChan = createChan;

