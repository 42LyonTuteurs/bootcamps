const Discord = require('discord.js');
const client = new Discord.Client();
const botId = '709771830222651492';
var users = new Array();

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
    let myRole = message.guild.roles.cache.get("710414732594511894");
    message.member.roles.add(myRole).catch(console.error);
    var user = new User(message.author.id, message.author.username);
    console.log("Sender id : " + user.id);
    console.log("Sender name : " + user.username);
    users.push(user);
  }
  else if (message.content === '!list') {
    for (let i = 0; i < users.length; i++)
      console.log("User " + i + " name : " + users[i].username)
    }
  }
});

client.login('token');
