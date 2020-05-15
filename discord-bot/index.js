const Discord = require('discord.js');
const utils = require('./utils.js');
const c = require('./correction.js');
const configFile = require ('./config.json');
const cron = require("node-cron");
const fs = require("fs");
const config = configFile.botConfig;
const client = new Discord.Client();
var faker = require('faker/locale/cz');
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

function subscribe(message)
{
  let myRole = message.guild.roles.cache.get(config.bootcampRoleId);
  message.member.roles.add(myRole).catch(console.error);
  var user = new User(message.author.id, message.author.username);
  utils.logs("subscribtion of :" + user.username + " " + user.id);
  users.push(user);
};

function unsubscribe(message)
{
  let index = users.findIndex(u => u.username == message.author.username);
  if (index != -1)
    users.splice(index, 1);
}

function list(message)
{
  if (utils.isAdmin(message.author))
  {
    for (let i = 0; i < users.length; i++)
    console.log("User " + i + " name : " + users[i].username + "\t\tId : " + users[i].id);
  }
  else
    utils.logs("You should be admin to this");
}

function help(message)
{
  message.channel.send("!help");
}

function fakerDb()
{
  for (let i = 0; i < 10; i++)
  {
    var user = new User(faker.finance.account(18), faker.name.firstName());
    users.push(user);
  }
}

client.on('ready', () => {
  fakerDb();
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
      if (command === 'subscribe')
        subscribe(message);
      else if (command === 'unsubscribe')
        unsubscribe(message);
      else if (command === 'setCorrection')
        setCorrection(message);
      else if (command === 'list')
        list(message);
      else if (command === 'correction')
        c.correction(users);
      else
        help(message);
    }
  }
});

client.login(config.token);
