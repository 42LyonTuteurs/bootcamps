const Discord = require('discord.js');
const { Users, Stat, Day } = require('./dbObject');
const { Op } = require('sequelize');
const utils = require('./utils.js');
const c = require('./correction.js');
const cm = require('./channelManager');
const admin = require('./administrator.js');
const userCmd = require('./userCommands');
const configFile = require ('./config.json');
const cron = require("node-cron");
const fs = require("fs");
const botConfig = configFile.botConfig;
const client = new Discord.Client();
const faker = require('faker');
const emoji = require('node-emoji');
const dateFormat = require('dateformat');
const PREFIX = botConfig.prefix;
const config  = configFile.production

function User(id, username) {
	this.id = id;
	this.username = username;
}

async function fakerDb()
{
	let LoginList = await utils.AllLogin();
	let userNb = LoginList.length;
	if (userNb < 0) {
		for (let i = 0; i < 3; i++) {
			var user = new User(faker.finance.account(18), faker.name.firstName(undefined).toLowerCase());
			await utils.addUser(user.id, user.username);
			await userCmd.createChan(client, user.username, 1)
		}
	}
}

function debug(message, commandArgs) {
	console.log(message.guild.roles)
}

function logs(string, login) {
	var date = dateFormat();
	let output;
	if (login)
		output = date + " | " + login + "\n" + string + "\n\n";
	else
		output = date + " :\n" + string + "\n\n";
	fs.appendFile('app.log', output, (err) => {
		if (err) throw err;
	})
	const guild = client.guilds.cache.find(guild => guild.name === config.ServerName);
	let logChannel = guild.channels.cache.find(chan => chan.name === botConfig.logChannelName)
	logChannel.send("```" + output + "```")
}

async function init(guild) {
	if (!guild.channels.cache.find(guild => guild.name === "Bootcamp")) {
		await cm.initCategories(guild)
	}
	await fakerDb();
}

client.on('ready', async() => {
	fs.writeFile('app.log', "", (err) => {
		if (err) throw err;
	})
	const guild = client.guilds.cache.find(guild => guild.name === config.ServerName);
	await init(guild);
	console.log(`Logged in as ${client.user.tag}!`);
	logs(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
	if (message.author.username != "bootcamp" && !message.author.bot && message.content.search("!mana") == -1 && message.content.startsWith(PREFIX)) {
		if (!message.member) {
			message.author.send('```DM disable, please call me from 42 Lyon Server```')
			return;
		}
		if (message.content.length > 100) {
			message.channel.send("NOPE");
			return;
		}
		let LoginList = await utils.AllLogin();
		let name = message.member.nickname == null ? message.author.username : message.member.nickname;
		let discord_id = message.member.id;
		if (message.content !== PREFIX + "help" && message.content !== PREFIX + "debug" &&
			message.content !== PREFIX + "subscribe" && !LoginList.includes(name)) {
			message.channel.send("Please " + PREFIX + "subscribe to access the commands")
			return;
		}
		logs(message.content, name);
		client.emit("checkMessage", message);
		const input = message.content.slice(PREFIX.length).split(' ');
		const command = input.shift();
		const commandArgs = input.join(' ');
		if (command === 'debug') {
			debug(message, commandArgs);
			return;
		}
		if (command === 'admin')
			admin.adminCommands(message, commandArgs.split(" "), name, discord_id);
		else
			userCmd.userCommands(command, message, commandArgs, name, discord_id, client);
	}
});

exports.PREFIX = PREFIX;
exports.config = config;
exports.botConfig = botConfig;
exports.client = client;
module.exports.logs = logs;
client.login(botConfig.token);
