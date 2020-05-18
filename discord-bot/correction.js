const utils = require('./utils.js');

function correctedBy(message, commandArgs) {
	let corrector = commandArgs[1];
	let corrected = message.member.nickname;
	let day = commandArgs[2];
	if (!day)
		message.channel.send('Please tell me witch day you corected :\n```!corrected by ' + corrector + ' <Day Corrected>```');
	else
		console.log(corrector + " corrected day " + day + " of " + corrected);
		// correction done
}

function validatedSomeone(message, commandArgs) {
	let corrected = commandArgs[0];
	let corrector = message.member.nickname;
	let day = commandArgs[1];
	if (!day)
		message.channel.send('Please tell me witch day you corected :\n```!corrected ' + corrected + ' <Day Corrected>```');
	else
		console.log(corrector + " corrected day " + day + " of " + corrected);
}

module.exports = {
	correction(usersSouce) {
		var correcter = usersSouce.slice();
		var corrected = usersSouce.slice();
		var userNb = corrected.length;
		for (let i = 0; i < userNb; i++)
		{
			let random = utils.getRandomArbitrary(1, correcter.length - 1);
			while (correcter[random].username == corrected[i].username)
				random = utils.getRandomArbitrary(1, correcter.length - 1);
			console.log(corrected[i].username + " will be corrected by " + correcter[random].username);
			// Set correcetion
			correcter.splice(random, 1);
		}
	},
	corrected : async function(message, commandArgs) {
		// console.log("commands : " + commandArgs);
		LoginList = await utils.AllLogin();
		if (commandArgs[0] == 'by' && LoginList.includes(commandArgs[1]))
			correctedBy(message, commandArgs);
		else
			console.log("Could not find matching correction");
	},
	validated : async function(message, commandArgs) {
		LoginList = await utils.AllLogin();
		if (LoginList.includes(commandArgs[0]))
			validatedSomeone(message, commandArgs);
		else
			console.log("Could not find matching correction")
	},
}