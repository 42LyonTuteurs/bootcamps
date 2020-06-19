const utils = require('./utils.js');
const msg = require('./message.js')
const c = require('./correction.js');
const i = require('./index');
const usrCtrl = require('./controllers/UsersCtrl')

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
    let discord_id;
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
            r.send("<@" + user.discord_id + ">\n" + msg.help);
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
    const user = await utils.getUserByLogin(name);

    // await utils.deleteUserByLogin(name);
    await utils.userGiveUpActivity(await utils.getUserByLogin(name));
    message.guild.channels.cache.forEach(element => {
        if (element.name === "bootcamp-" + name.toLowerCase())
            element.delete();
    });
    await utils.resetAllUnsubscribedCorrections(user);
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

function help(message) {
    message.channel.send(msg.help);
}

// async function enableCorrection(message, commandArgs, name) {
//    set user enable correction
// }
//
// async function disableCorrection(message, commandArgs, name) {
//    set user disable correction
// }


//TODO deja en cour dans correction.js
async function dayDone(message, commandArgs, user) {
   if (await utils.nbOfPendingCorrection(user) >= 2) {
           message.channel.send('First do your corrections already sets');
//    send pending correction
   } else {
       await c.setDayAsFinished(message, user, commandArgs);
   }
}

async function miss(message, commandArg, user) {
    const other = await usrCtrl.getUserByLogin(commandArg[1])
    if (commandArg[0] === 'corrector')
        await missCorrector(message, user, other)
    else if (commandArg[0] === 'corrected')
        await missCorrected(message, commandArg, name)
    else
        message.channel.send("please respect the format : \n `;miss <corrector/corrected> <login>`")
}

async function missCorrector(message, user, corrector) {
    const missingUser = corrector
    const corrected = user
    const correc = await utils.getCorrectionsNotDoneByUsers(missingUser, corrected)
    if (correc.length)
        await utils.missCorrector(message, correc, missingUser, corrected);
    else
        message.channel.send("this correction doesn't exist");
}

async function missCorrected(message, user, corrected) {
    const missingUser = corrected
    const corrector = user
    const correc = await utils.getCorrectionsByUsers(corrector, missingUser)
    await utils.missCorrected(message, correc, missingUser, corrector);
}

async function getCorrections(message, user) {
    message.channel.send(await utils.correctInfoByUser(message, user))
}

async function corrected(message, commandArgs, user) {
    let userCorrected = await utils.getUserByLogin(commandArgs[0])
    let mark = commandArgs[1];
    if (!userCorrected)
        return await utils.error("could not find this user", user);
    if (!mark)
        return await utils.error("please give me the mark : \n`;corrected " + userCorrected.login + " <notValidated/done/outstanding>`", user);
    let correction = await utils.getCorrectionsNotDoneByUsers(user, userCorrected)
    if (!correction)
        return await utils.error("No matching corrections found", user)
    let day = await utils.getDayByDayId(correction[0].day_id)
    let day_id = day.day_id;
    await utils.updateCorrectorValidation(correction[0].correc_id)
    if (mark === "done") {
        await utils.updateValidatedCorrection(correction[0].correc_id)
    } else if (mark === "outstanding") {
        await utils.updateValidatedCorrection(correction[0].correc_id)
        await utils.updateOutstanding(correction[0].correc_id)
    } else
        return await utils.error("please give me the mark : \n`;corrected " + userCorrected.login + " <notValidated/done/outstanding>`", user);
    await utils.checkDayFinished(message, day_id, user, userCorrected)
}

async function validate(message, commandArgs, user) {
    let userCorrector = await utils.getUserByLogin(commandArgs[0])
    if (!userCorrector)
        return await utils.error("could not find this user", user);
    let correction = await utils.getCorrectionsNotDoneByUsers(userCorrector, user)
    if (!correction)
        return await utils.error("No matching corrections found", user);
    let day = await utils.getDayByDayId(correction[0].day_id)
    let day_id = day.day_id;
    await utils.updateCorrectedValidation(correction.correc_id)
    await utils.checkDayFinished(message, day_id, userCorrector, user)
}

async function userCommands(command, message, commandArgs, name, discord_id, client) {
    const LoginList = await utils.AllLogin();
    const user = await usrCtrl.getUserByLogin(name);
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
    else if (command === 'day' && commandArgs === 'done')
        dayDone(message, commandArgs.split(" "), user);
    // else if (command === 'correc')
    //     await utils.correctInfoByUser(message, user);
    else if (command === 'miss')
        await miss(message, commandArgs.split(" "), user);
    else if (command === 'get' && commandArgs === 'corrections')
        await getCorrections(message, user);
    else if (command === 'corrected')
        await corrected(message, commandArgs.split(" "), user);
    else if (command === 'validate')
        await validate(message, commandArgs.split(" "), user);
    // else if (command === 'correction') {
    //     let error = await c.correction(LoginList, commandArgs, discord_id, client);
    //     if (error == 1) {
    //         help(message);
    //     }
    // } else if (command === 'corrected') {
    //     if (await c.corrected(message, commandArgs.split(" "), name) === 1)
    //         help(message);
    // } else if (command === 'validates') {
    //     if (await c.validated(message, commandArgs.split(" "), name) === 1)
    //         help(message);
    // }
    else if (command === 'help')
        help(message);
    else {
        message.channel.send("```" + message.content + " is an unknown function, please try " + i.PREFIX + "help```")
            .then(msg => {
                msg.delete({timeout: 10000})
            });
    }
}

module.exports.userCommands = userCommands;
module.exports.createChan = createChan;

