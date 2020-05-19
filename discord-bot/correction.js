const utils = require('./utils.js');

async function correctedBy(message, commandArgs) {
	let corrector = commandArgs[1];
	let corrected = message.member.nickname;
	let day = commandArgs[2];
	if (!day)
		message.channel.send('Please tell me witch day you corected :\n```!corrected by ' + corrector + ' <Day Corrected>```');
	else{
		// correction done
		const dayCorrected = await utils.getDayByDayId(await utils.getDayIdByUser(corrected, day));
		const dayCorrector = await utils.getDayByDayId(await utils.getDayIdByUser(corrector, day));
		await utils.updateDayCorrected(dayCorrected);
		await utils.updateDayCorrection(dayCorrector);
		console.log(corrector + " corrected day " + day + " of " + corrected);

	}
}

async function validatedSomeone(message, commandArgs) {
	let corrected = commandArgs[0];
	let corrector = message.member.nickname;
	let day = commandArgs[1];
	if (!day)
		message.channel.send('Please tell me witch day you corected :\n```!corrected ' + corrected + ' <Day Corrected>```');
	else{
		const dayCorrected = await utils.getDayByDayId(await utils.getDayIdByUser(corrected, day));
		const dayCorrector = await utils.getDayByDayId(await utils.getDayIdByUser(corrector, day));
		await utils.updateDayCorrected(dayCorrected);
		await utils.updateDayCorrection(dayCorrector);
		console.log(corrector + " corrected day " + day + " of " + corrected);
	}
}

async function  setCorrection(corrector, corrected, day) {
	// const correctorDay = await utils.getDayByDayId(await utils.getDayIdByUser(await utils.getUserByLogin(corrector)));
	let correctorDay = await utils.getUserByLogin(corrector)
	correctorDay = await utils.getDayIdByUser(correctorDay, day);
	correctorDay = await utils.getDayByDayId(correctorDay);

	// const correctedDay = await utils.getDayByDayId(await utils.getDayIdByUser(await utils.getUserByLogin(corrected), 0));
	let correctedDay = await utils.getUserByLogin(corrected);
	correctedDay = await utils.getDayIdByUser(correctedDay, day);
	correctedDay = await utils.getDayByDayId(correctedDay);

	await utils.updateDayWhoCorrection(correctorDay, corrected)
	await utils.updateDayWhoCorrected(correctedDay, corrector)
}

function sendCorrection(message, corrector, corrected)
{
	message.guild.channels.cache.forEach(element => {
		if (element.name == "bootcamp-" + corrector)
			element.send("You will correct " + corrected);
		else if (element.name == "bootcamp-" + corrected)
			element.send("You will be corrected by " + corrector);
	});
}

module.exports = {
	async correction(message, usersSouce, day) {
		// if ()
			let correcter = usersSouce.slice();
		let corrected = usersSouce.slice();
		let userNb = corrected.length;
		for (let i = 0; i < userNb; i++)
		{
			let random = utils.getRandomArbitrary(0, correcter.length - 1);
			while (correcter[random].username == corrected[i].username)
				random = utils.getRandomArbitrary(0, correcter.length - 1);
			console.log(corrected[i].username + " will be corrected by " + correcter[random].username);
			await setCorrection(correcter[random].username, corrected[i].username, day);
			sendCorrection(message, correcter[random].username, corrected[i].username);
			correcter.splice(random, 1);
		}
	},

	corrected : async function(message, commandArgs) {
		// console.log("commands : " + commandArgs);
		let LoginList = await utils.AllLogin();
		if (commandArgs[0] == 'by' && LoginList.includes(commandArgs[1]))
			await correctedBy(message, commandArgs);
		else
			console.log("Could not find matching correction");
	},

	validated : async function(message, commandArgs) {
		let LoginList = await utils.AllLogin();
		if (LoginList.includes(commandArgs[0]))
			await validatedSomeone(message, commandArgs);
		else
			console.log("Could not find matching correction")
	},
}