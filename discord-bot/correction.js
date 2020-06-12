const utils = require('./utils.js');
var shuffle = require('shuffle-array');

// async function correctedBy(message, commandArgs, name) {
//     let corrector = commandArgs[1];
//     let corrected = name;
//     let day = commandArgs[2];
//     if (day == null || day.length != 1) {
//         message.channel.send("wrong day");
//     }
//     if (day === undefined || corrected === undefined || corrector === undefined)
//         message.channel.send('Please tell me witch day you corrected :\n```!corrected by ' + corrector + ' <Day Corrected>```');
//     else if (day < 0 || day > 4 || day === null) {
//         message.channel.send("wrong day");
//         return;
//     }
//     else{
//         corrected = await utils.getUserByLogin(corrected);
//         corrector = await utils.getUserByLogin(corrector);
//         let dayCorrected = await utils.getDayByDayId(await utils.getDayIdByUser(corrected, day));
//         let dayCorrector = await utils.getDayByDayId(await utils.getDayIdByUser(corrector, day));
//         if (dayCorrected == null || dayCorrected.who_corrected == null){
//             message.channel.send('This day doesn\'t exist');
//         } else if (dayCorrected.who_corrected != corrector.login || dayCorrector.who_correction != corrected.login){
//             message.channel.send('Wrong Login');
//         }  else if(dayCorrected.corrected_send == 1) {
//             message.channel.send('The correction is already finished');
//         }else {
//             await utils.updateDayCorrected(dayCorrected);
//             await utils.updateDayCorrection(dayCorrector);
//             await utils.updateDayCorrectedSend(dayCorrected);
//             dayCorrected = await utils.getDayByDayId(await utils.getDayIdByUser(corrected, day));
//             dayCorrector = await utils.getDayByDayId(await utils.getDayIdByUser(corrector, day));
//             await updateDay(dayCorrector);
//             await updateDay(dayCorrected);
//             dayCorrected = await utils.getDayByDayId(await utils.getDayIdByUser(corrected, day));
//             dayCorrector = await utils.getDayByDayId(await utils.getDayIdByUser(corrector, day));
//             await updateStat(corrected.login, dayCorrected, "corrected");
//             await updateStat(corrector.login, dayCorrector, "corrector");
//             console.log(corrector.login + " corrected day " + day + " of " + corrected.login);
//             message.channel.send("You validated " + corrector.login + "'s correction on day " + day);
//         }
//
//
//     }
// }
//
// async function validatedSomeone(message, commandArgs, name) {
//     let corrected = commandArgs[0];
//     let corrector = name;
//     let day = commandArgs[1];
//     if (day == null || day.length != 1) {
//         message.channel.send('This day doesn\'t exist');
//     }
//     if (day < 0 || day > 4) {
//         message.channel.send('This day doesn\'t exist');
//         return;
//     }
//     let validated = commandArgs[2];
//     if (day === undefined || corrected === undefined || corrector === undefined){
//         message.channel.send('Please tell me witch day you corected :\n```!validates ' + corrected + ' <Day Corrected> <validated/notvalidated>```');
//     } else if(!validated) {
//         message.channel.send('Please tell me if the day is done or not :\n```!validates ' + corrected + ' <Day Corrected> <validated/notvalidated>```');
//     } else{
//         corrected = await utils.getUserByLogin(corrected);
//         corrector = await utils.getUserByLogin(corrector);
//         let dayCorrected = await utils.getDayIdByUser(corrected, day);
//         dayCorrected = await utils.getDayByDayId(dayCorrected);
//
//         let dayCorrector = await utils.getDayIdByUser(corrector, day);
//         dayCorrector = await utils.getDayByDayId(dayCorrector);
//         if (dayCorrected == null || dayCorrected.who_corrected == null) {
//             message.channel.send('This day doesn\'t exist');
//         }else if (dayCorrected.who_corrected != corrector.login || dayCorrector.who_correction != corrected.login){
//             message.channel.send('Wrong Login');
//         } else if(dayCorrector.correction_send == 1){
//             message.channel.send('The correction is already finished');
//         } else if(validated !== "validated" && validated !== "notvalidated"){
//             message.channel.send('Please tell me if the day is done or not :\n```!validates ' + corrected.login + ' <Day Corrected> <validated/notvalidated>```');
//         } else {
//             await utils.updateDayCorrected(dayCorrected);
//             await utils.updateDayCorrection(dayCorrector);
//             if (validated === "validated"){
//                 await utils.updateDayValidated(dayCorrected, 1);
//             } else
//                 await utils.updateDayValidated(dayCorrected, 0);
//             await utils.updateDayCorrectionSend(dayCorrector);
//             dayCorrected = await utils.getDayIdByUser(corrected, day);
//             dayCorrected = await utils.getDayByDayId(dayCorrected);
//
//             dayCorrector = await utils.getDayIdByUser(corrector, day);
//             dayCorrector = await utils.getDayByDayId(dayCorrector);
//             await updateDay(dayCorrector);
//             await updateDay(dayCorrected);
//             dayCorrected = await utils.getDayIdByUser(corrected, day);
//             dayCorrected = await utils.getDayByDayId(dayCorrected);
//
//             dayCorrector = await utils.getDayIdByUser(corrector, day);
//             dayCorrector = await utils.getDayByDayId(dayCorrector);
//             await updateStat(corrected.login, dayCorrected, "corrected");
//             await updateStat(corrector.login, dayCorrector, "corrector");
//             message.channel.send("You " + validated + " " + corrected.login + " day " + day);
//         }
//
//     }
// }
//
// async function  setCorrection(corrector, corrected, day) {
//     // const correctorDay = await utils.getDayByDayId(await utils.getDayIdByUser(await utils.getUserByLogin(corrector)));
//     let correctorDay = await utils.getUserByLogin(corrector)
//     correctorDay = await utils.getDayIdByUser(correctorDay, day);
//     correctorDay = await utils.getDayByDayId(correctorDay);
//
//     // const correctedDay = await utils.getDayByDayId(await utils.getDayIdByUser(await utils.getUserByLogin(corrected), 0));
//     let correctedDay = await utils.getUserByLogin(corrected);
//     correctedDay = await utils.getDayIdByUser(correctedDay, day);
//     correctedDay = await utils.getDayByDayId(correctedDay);
//
//     await utils.updateDayWhoCorrection(correctorDay, corrected)
//     await utils.updateDayWhoCorrected(correctedDay, corrector)
// }
//
// function sendCorrection(client, corrector, corrected, day)
// {
//     client.channels.cache.forEach(element => {
//         let str = "";
//         if (element.name == "bootcamp-" + corrector.toLowerCase()) {
//             str += "\n----------------------------------------------------------------------" +
//                 "\nYou will correct __**" + corrected + "**__'s day " + day +
//                 "\nenter the following command to validate " + corrected + " day " + day + "\n" +
//                 "```:validates " + corrected + " " + day + " <validated/notvalidated>```\n";
//         }
//         else if (element.name == "bootcamp-" + corrected.toLowerCase())
//             str += "\n----------------------------------------------------------------------" +
//                 "\nYou will be corrected by __**" + corrector + "**__ on your day " + day +
//                 "\nenter the following command to certificate that " + corrector + " corrected your day " + day + "\n" +
//                 "```:corrected by " + corrector + " " + day + "```\n";
//         if (str)
//             element.send(str);
//     });
// }
//
// async function updateStat(login, day, role){
//     const stat = await utils.getStatByLogin(login);
//     if (day.corrected == 2 && role === "corrected"){
//         await utils.updateStatCorrected(stat);
//     }
//     if (day.correction == 2 && role === "corrector"){
//         await utils.updateStatCorrection(stat);
//     }
//     if (day.day_complete == 1){
//         await utils.updateStatDaysDone(stat);
//     }
// }
//
// async function updateDay(day){
//     if (day.correction == 2 && day.corrected == 2 && day.day_validated == 1)
//         await utils.updateDayComplete(day);
// }
//
// function Correction(correcter, corrected) {
//     this.corrected = corrected;
//     this.correcter = correcter;
// }

module.exports = {


//TODO
    setDayAsFinished : async function(message, user, argv){
        let nbDay = argv[0];
        console.log("1");

        const stat = await utils.getStatByLogin(user.login);
        console.log("3");

        const day_id = await utils.getDayIdByUser(user, nbDay)
        console.log("pls " + day_id);
        console.log("pls " + nbDay);
        console.log("pls " + user.discord_id);
        console.log("pls " + stat.user_id);
        const day =  await utils.getDayByDayId(day_id)
        console.log("4");

        // const list = await utils.CorrectionsNotDone(user);
        // console.log("5");
        //
        // if (list !== undefined && list.length >= 2)
        //     message.channel.send('First do your corrections already sets');
        //else
        console.log("6");
        // mettre la value day set a 1
        const corrector = await utils.getRandomForCorrection();
        console.log("7");

        await utils.createNewCorrectionByDiscordId(day, discord_id, corrector.discord_id);
        console.log("8");

        message.channel.send('you wil be corrected by ' + corrector.login + ' on you day ' + nbDay);

    },

    // correction : async function(usersSouce, commandArg, discord_id, client) {
    //     if (utils.isAdmin(discord_id)) {
    //         let users = shuffle(usersSouce.slice());
    //         var correctionArray = [];
    //         let day = commandArg;
    //         if (day != undefined) {
    //             for (let i = 0; i < users.length; i++) {
    //                 if (i == users.length - 1)
    //                     correctionArray.push(new Correction(users[i], users[0]));
    //                 else
    //                     correctionArray.push(new Correction(users[i], users[i + 1]));
    //             }
    //         }
    //         console.log(correctionArray);
    //         for (let i = 0; i < correctionArray.length; i++) {
    //             console.log(correctionArray[i].corrected + " will be corrected by " + correctionArray[i].correcter);
    //             await setCorrection(correctionArray[i].correcter, correctionArray[i].corrected, day);
    //             sendCorrection(client, correctionArray[i].correcter, correctionArray[i].corrected, day);
    //         }
    //     } else{
    //         return (1);
    //     }
    //
    // },
    // corrected : async function(message, commandArgs, name) {
    //     // console.log("commands : " + commandArgs);
    //     let LoginList = await utils.AllLogin();
    //     if (commandArgs[0] == 'by' && LoginList.includes(commandArgs[1]))
    //         await correctedBy(message, commandArgs, name);
    //     else if (commandArgs[0] == 'by'){
    //         message.channel.send('This login doesn\'t exist');
    //     } else {
    //         return (1);
    //     }
    // },
    //
    // validated : async function(message, commandArgs, name) {
    //     let LoginList = await utils.AllLogin();
    //     if (LoginList.includes(commandArgs[0]))
    //         await validatedSomeone(message, commandArgs, name);
    //     else
    //         message.channel.send('This login doesn\'t exist');
    // },
}