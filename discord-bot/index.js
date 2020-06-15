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
const PREFIX = ';';
// const categories = [config.privateChannelCategoryId1, config.privateChannelCategoryId2, config.privateChannelCategoryId3];

// set it to development or production
const config  = configFile.development
// Cronjobs

// cron.schedule("0 42 8 25 * * ", function() {
// 	client.channels.cache.get(config.testChannelId).send("here is the day00 subject !\nTo install anaconda in the ex00, you have to change some lines on linux : ```1. curl -LO \"https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh\"\n" +
// 		"2. sh Miniconda3-latest-Linux-x86_64.sh -b -p ~/Miniconda3\n" +
// 		"3. conda install -y \"jupyter\" \"numpy\" \"pandas\"\n" +
// 		"6. which python\n```", {files: ["./day00.pdf"]});
// });
//
// cron.schedule("0 42 8 26 * * ", function() {
// 	client.channels.cache.get(config.testChannelId).send("here is the Day01 subject", {files: ["./day01.pdf"]});
// });
//
// cron.schedule("0 42 23 26 * * ", async function() {
// 	// Correction
// 	let LoginList = await utils.AllLogin();
// 	await c.correction(LoginList, 0, "374265216608763907", client);
// });
//
// cron.schedule("0 42 8 27 * * ", function() {
// 	client.channels.cache.get(config.testChannelId).send("here is the Day02 subject", {files: ["./day02.pdf"]});
// });
//
// cron.schedule("0 42 23 27 * * ", async function() {
// 	// Correction
// 	let LoginList = await utils.AllLogin();
// 	await c.correction(LoginList, 1, "374265216608763907", client);
// });
//
// cron.schedule("0 42 8 28 * * ", function() {
// 	client.channels.cache.get(config.testChannelId).send("here is the Day03 subject", {files: ["./day03.pdf"]});
// });
//
// cron.schedule("0 42 23 28 * * ", async function() {
// 	// Correction
// 	let LoginList = await utils.AllLogin();
// 	await c.correction(LoginList, 2, "374265216608763907", client);
// });
//
// cron.schedule("0 42 8 29 * * ", function() {
// 	client.channels.cache.get(config.testChannelId).send("here is the Day04 subject", {files: ["./day04.pdf"]});
// });
//
// cron.schedule("0 42 23 29 * * ", async function() {
// 	// Correction
// 	let LoginList = await utils.AllLogin();
// 	await c.correction(LoginList, 3, "374265216608763907", client);
// });
//
// cron.schedule("0 42 23 30 * * ", async function() {
// 	// Correction
// 	let LoginList = await utils.AllLogin();
// 	await c.correction(LoginList, 4, "374265216608763907", client);
// });

// End Cronjobs

function User(id, username) {
	this.id = id;
	this.username = username;
}

async function fakerDb()
{
	let LoginList = await utils.AllLogin();
	let userNb = LoginList.length;
	if (userNb < 4) {
		for (let i = 0; i < 4; i++) {
			var user = new User(faker.finance.account(18), faker.name.firstName(undefined).toLowerCase());
			await utils.addUser(user.id, user.username);
			await userCmd.createChan(client, user.username, 1)
		}
	}
}

function debug(message, commandArgs) {
	console.log(message.guild.channels.cache.find(chan => chan.name === "Bootcamp1"))
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
	// console.log(guild)
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
		// console.log(message.guild.channels.cache)
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
		if (config.env != "dev" || (message.content !== PREFIX + "help" && message.content !== PREFIX + "debug" &&
			message.content !== PREFIX + "subscribe" && !LoginList.includes(name))) {
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
module.exports.logs = logs;
client.login(botConfig.token);
