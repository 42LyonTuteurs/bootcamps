const utils = require('./utils.js');

async function correctedBy(message, commandArgs) {
	let corrector = commandArgs[1];
	let corrected = message.member.nickname;
	let day = commandArgs[2];
	if (!day)
		message.channel.send('Please tell me witch day you corected :\n```!corrected by ' + corrector + ' <Day Corrected>```');
	else{
		// console.log("login corrected :" + corrected);
		// console.log("login corrector :" + corrector);
		// correction done
		corrected = await utils.getUserByLogin(corrected);
		corrector = await utils.getUserByLogin(corrector);
		// console.log("user corrected :" + corrected);
		// console.log("user corrector:" + corrector);
		const dayCorrected = await utils.getDayByDayId(await utils.getDayIdByUser(corrected, day));
		const dayCorrector = await utils.getDayByDayId(await utils.getDayIdByUser(corrector, day));
		// console.log("day corrected :" + dayCorrected);
		// console.log("day corrector:" + dayCorrector);
		// console.log("whoCorrection" + dayCorrected.who_corrected);
		// console.log("whoCorrected" + dayCorrector.who_correction);


		if (dayCorrected.who_corrected != corrector.login || dayCorrector.who_correction != corrected.login){
			message.channel.send('Wrong Login');
		}  else if(dayCorrected.corrected_send == 1) {
			message.channel.send('The correction is already finished');
		}else {
			// console.log("c'est good");
			await utils.updateDayCorrected(dayCorrected);
			await utils.updateDayCorrection(dayCorrector);
			await utils.updateDayCorrectedSend(dayCorrected);
			await this.updateDay(dayCorrector);
			await this.updateDay(dayCorrected);
			await this.updateStat(corrected.login, dayCorrected);
			await this.updateStat(corrector.login, dayCorrector);
		}
		console.log(corrector.login + " corrected day " + day + " of " + corrected.login);

	}
}

async function validatedSomeone(message, commandArgs) {
	let corrected = commandArgs[0];
	let corrector = message.member.nickname;
	let day = commandArgs[1];
	let validated = commandArgs[2];
	if (!day){
		message.channel.send('Please tell me witch day you corected :\n```!corrected ' + corrected + ' <Day Corrected> <Validated>```');
	} else if(!validated) {
		message.channel.send('Please tell me if the day is done or not :\n```!corrected ' + corrected + ' <Day Corrected> <Validated>```');
	} else{
		corrected = await utils.getUserByLogin(corrected);
		corrector = await utils.getUserByLogin(corrector);
		let dayCorrected = await utils.getDayIdByUser(corrected, day);
			dayCorrected = await utils.getDayByDayId(dayCorrected);

		let dayCorrector = await utils.getDayIdByUser(corrector, day);
		dayCorrector = await utils.getDayByDayId(dayCorrector);
		if (dayCorrected.who_corrected != corrector.login || dayCorrector.who_correction != corrected.login){
			message.channel.send('Wrong Login');
		} else if(dayCorrector.correction_send == 1){
			message.channel.send('The correction is already finished');
		} else if(validated !== "validated" && day !== "validated"){
			message.channel.send('Please tell me if the day is done or not :\n```!corrected ' + corrected.login + ' <Day Corrected> <Validated>```');
		}else {
			await utils.updateDayCorrected(dayCorrected);
			await utils.updateDayCorrection(dayCorrector);
			if (validated === "validated"){
				await utils.updateDayValidated(dayCorrected, 1);
			} else
				await utils.updateDayValidated(dayCorrected, 0);
			await utils.updateDayCorrectionSend(dayCorrector);
			await this.updateDay(dayCorrector);
			await this.updateDay(dayCorrected);
			await this.updateStat(corrected.login, dayCorrected);
			await this.updateStat(corrector.login, dayCorrector);
		}
		console.log(corrector.login + " corrected day " + day + " of " + corrected.login);
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
	async correction(message, usersSouce, commandArg) {
		// if ()
			let correcter = usersSouce.slice();
		let corrected = usersSouce.slice();
		if (commandArg[0]){
			let day = commandArg[0];
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
		} else {
			message.channel.send('Please tell me witch day you create :\n```!correction <Day Corrected>```');
		}

	},

	updateStat : async function(login, day){
		const stat = await utils.getStatByLogin(login);
		if (day.corrected == 2){
			await utils.updateStatCorrected(stat);
		}
		if (day.correction == 2){
			await utils.updateStatCorrection(stat);
		}
		if (day.day_complete == 1){
			await utils.updateStatDaysDone(stat);
		}
	 },

	updateDay : async function(day){
		if (day.correction == 2 && day.corrected == 2 && day.day_validated == 1)
			await utils.updateDayComplete(day);
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