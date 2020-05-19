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
const antispam = require('better-discord-antispam'); // Requiring this module.
const PREFIX = '!';


// Cronjobs

cron.schedule("42 8 18 * * ", function() {
  client.channels.cache.get(config.testChannelId).send("here is the Day01 subject", {files: ["./day00.pdf"]});
});

cron.schedule("42 8 19 * * ", function() {
  client.channels.cache.get(config.testChannelId).send("here is the Day02 subject", {files: ["./day01.pdf"]});
});

cron.schedule("42 8 20 * * ", function() {
  client.channels.cache.get(config.testChannelId).send("here is the Day03 subject", {files: ["./day02.pdf"]});
});

cron.schedule("42 8 21 * * ", function() {
  client.channels.cache.get(config.testChannelId).send("here is the Day04 subject", {files: ["./day03.pdf"]});
});

cron.schedule("42 8 22 * * ", function() {
  client.channels.cache.get(config.testChannelId).send("here is the Day0 subject", {files: ["./day04.pdf"]});
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
  var user = new User(message.member.id, message.member.nickname);
  utils.logs("subscribtion of :" + user.username + " " + user.id);
  users.push(user);
  await utils.addUser(user.id, user.username);
  if (!message.guild.channels.cache.map(t => t.name).includes("bootcamp-" + message.member.nickname)) {
    const everyoneRole = message.guild.roles.cache.get(config.everyoneRoleId);
    const PrivateChannelWithBot = "bootcamp " + message.member.nickname;
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
          r.send("Here is your private channel with the bot, please enter here your commands to interract with the bot");
        })
        .catch(console.error);
  }
};

async function unsubscribe(message)
{
  await utils.deleteUserByLogin(message.member.nickname);
  let channelToDestroy;
  let index = users.findIndex(u => u.username == message.member.nickname);
  if (index != -1)
    users.splice(index, 1);
  if (message.guild.channels.cache.map(t => t.name).includes("bootcamp-" + message.member.nickname)) {
    message.guild.channels.cache.forEach(element => {
      if (element.name == "bootcamp-" + message.member.nickname)
        channelToDestroy = element;
    });
  }
  channelToDestroy.delete();
}

async function list(message)
{
  if (utils.isAdmin(message.member))
  {
    await utils.printAll();
  }
  else
    utils.logs("You should be admin to this");
}

async function info(message, argv)
{
  let LoginList = await utils.AllLogin();
  if (!argv[0])
      utils.printUserInfoByLoginInChannel(message, message.member.nickname)
  else {
    argv.forEach(element => {
      if (LoginList.includes(element))
        utils.printUserInfoByLoginInChannel(message, element);
      else 
        message.channel.send("```Could not find user with " + element + " username```");
  })
  }
}

function help(message)
{
  message.channel.send("!help");
}

async function fakerDb()
{
  for (let i = 0; i < 20; i++)
  {
    var user = new User(faker.finance.account(18), faker.name.firstName());
    await utils.addUser(user.id, user.username);
    users.push(user);
  }
  // users.push (await utils.addUser("220625639655473152", "tclaudel"));
  // users.push (await utils.addUser("374265216608763907", "jdarko"));
}

client.on('ready', async() => {
  antispam(client, {
    limitUntilWarn: 3, // The amount of messages allowed to send within the interval(time) before getting a warn.
    limitUntilMuted: 5, // The amount of messages allowed to send within the interval(time) before getting a muted.
    interval: 20000, // The interval(time) where the messages are sent. Practically if member X sent 5+ messages within 2 seconds, he get muted. (1000 milliseconds = 1 second, 2000 milliseconds = 2 seconds etc etc)
    warningMessage: "if you don't stop from spamming, I'm going to punish you!", // Message you get when you are warned!
    muteMessage: "was muted since we don't like too much advertisement type people!", // Message sent after member X was punished(muted).
    maxDuplicatesWarning: 7,// When people are spamming the same message, this will trigger when member X sent over 7+ messages.
    maxDuplicatesMute: 10, // The limit where member X get muted after sending too many messages(10+).
    // ignoredRoles: ["Admin"], // The members with this role(or roles) will be ignored if they have it. Suggest to not add this to any random guys. Also it's case sensitive.
    // ignoredMembers: ["Mavis#2389"], // These members are directly affected and they do not require to have the role above. Good for undercover pranks.
    mutedRole: "muted", // Here you put the name of the role that should not let people write/speak or anything else in your server. If there is no role set, by default, the module will attempt to create the role for you & set it correctly for every channel in your server. It will be named "muted".
    timeMuted: 1000 * 600, // This is how much time member X will be muted. if not set, default would be 10 min.
    logChannel: "antispam-logs" // This is the channel where every report about spamming goes to. If it's not set up, it will attempt to create the channel.
  });
  if (await utils.UserNb() < 20)
    await fakerDb();
  fs.writeFile('app.log', "", (err) => {
    if (err) throw err;
  })
  console.log(`Logged in as ${client.user.tag}!`);
  utils.logs(`Logged in as ${client.user.tag}!`);

});

client.on('message', async message => {
  // console.log(message.guild.roles.cache);
  utils.logs("send : "+ message.content, message.member);
  LoginList = await utils.AllLogin();
  if (message.author.username != "bootcamp" && !message.author.bot && message.content.search("!mana") == -1)
  {
    if (!message.member) {
      message.author.send('```DM disable, please call me from 42 Lyon Server```')
      return ;
    }
    if (message.content.startsWith(PREFIX))
    {
      client.emit('checkMessage', message);
      const input = message.content.slice(PREFIX.length).split(' ');
      const command = input.shift();
      const commandArgs = input.join(' ');
      if (command === 'subscribe')
        subscribe(message);
      else if (command === 'info')
        info(message, commandArgs.split(" "));
      else if (command === 'unsubscribe')
        unsubscribe(message);
      else if (command === 'setCorrection')
        setCorrection(message);
      else if (command === 'list')
        list(message);
      else if (command === 'print')
        await utils.printUserInfoByLogin("jdarko");
      else if (command === 'setDay'){
        const usr = await utils.getUserByLogin("jdarko")
        const usr2 = await utils.getUserByLogin("")
        await utils.createDay(usr, 0);
        await utils.createDay(usr, 1);
      }
      else if (command === 'correction')
      {
        await c.correction(message, users, 0);
        const user = await utils.getUserByLogin("jdarko");
        // console.log(user.login);
        const dayId = await utils.getDayIdByUser(user, 0);
        // console.log(dayId);
        const day = await utils.getDayByDayId(dayId);
        // console.log(day);
        await utils.printDay(day);
      }
      else if (command === 'corrected')
        c.corrected(message, commandArgs.split(" "))
      else if (command === 'validated')
        c.validated(message, commandArgs.split(" "))
      else
        help(message);
    }
  }
});

client.login(config.token);
