const Discord = require('discord.js');
const client = new Discord.Client();
const botId = '709771830222651492';
var users;

function User(id, username) {
  this.id = id;
  this.username = username;
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
if (message.author.id != botId) {
	if (message.content === '!subscribe') {
    // message.channel.send(message.author.username + ' subcribed to the bootcamp');
    senderId = message.author.id
    senderUsername = message.author.username
    let myRole = message.guild.roles.cache.get("710414732594511894");
    message.member.roles.add(myRole).catch(console.error);
    var user = new User(message.author.id, message.author.username);
    message.channel.send("Sender id : " + user.id);
    message.channel.send("Sender name : " + user.username);
  }
});

client.login('NzA5NzcxODMwMjIyNjUxNDky.Xr0mbg.SjvKUCv5SJKSX048mpgg7iZvrG4');
