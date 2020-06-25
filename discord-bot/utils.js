const fs = require('fs');
var shuffle = require('shuffle-array');
const i = require('./index');
const { Users, Stat, Day } = require('./dbObject');
var emoji = require('node-emoji')
var userCtrl = require("./controllers/UsersCtrl");
var statCtrl = require("./controllers/StatCtrl");
var dayCtrl = require("./controllers/DayCtrl");
var correcCtrl = require("./controllers/CorrecCtrl");

module.exports = {

    isAdmin(name) {
        return (i.botConfig.admin.includes(name))
    },

    addUser: async function (discord_id, login) {
        await userCtrl.createUser(discord_id, login);
        await statCtrl.createStatByDiscordId(discord_id);
        const user = await this.getUserByDiscordId(discord_id);
        for (let i = 0; i < 5; i++) {
            await this.newDay(user, i);
        }
    },

    printUserInfoByLogin: async function (login) {
        console.log("printUserInfoByLogin");
        console.log(login);

        const user = await this.getUserByLogin(login)
        console.log("discord id     : " + user.discord_id);
        console.log("login          : " + user.login);
        await this.printStatByDiscordId(user.discord_id);
    },

    printUserInfoByLoginInChannel: async function (message, login) {
        const user = await this.getUserByLogin(login)
        await this.printStatByDiscordIdInChannel(message, user.discord_id, user.login);
    },

    getUserByLogin : async function(login){
        return await userCtrl.getUserByLogin(login);
    },

    getUserByDiscordId : async function(discord_id){
        return await userCtrl.getUserByDiscordId(discord_id);
    },

    updateCorrectedValidation : async function(correc_id) {
        return await correcCtrl.updateCorrectedValidation(correc_id)
    },

    updateFinishedCorrection : async function(correc_id) {
        return await correcCtrl.updateFinishedCorrection(correc_id)
    },

    updateCorrectorValidation : async function(correc_id) {
        return await correcCtrl.updateCorrectorValidation(correc_id)
    },

    updateValidatedCorrection : async function(correc_id) {
        return await correcCtrl.updateValidatedCorrection(correc_id)
    },

    updateOutstanding : async function(correc_id) {
        return await correcCtrl.updateOutstanding(correc_id)
    },

    checkDayFinished : async function(message, day_id, corrector, corrected) {
        let corrections = await correcCtrl.getCorrectionsByDayId(day_id)
        if (corrections[0].corrected_validation && corrections[0].corrector_validation) {
            if (corrections[0].finished_correc != 1) {
                let stat = await statCtrl.getStatByDiscordId(corrections[0].corrector_id)
                await statCtrl.updateStatCorrection(stat);
                await statCtrl.updatePendingCorrectionByStat(stat, -1);
                await this.updateFinishedCorrection(corrections[0].correc_id)
                await this.gainMana(message, corrector, 5)
                var score0 = await correcCtrl.getMark(day_id, corrections[0].corrector_id)
            }
        }
        if (corrections[1].corrected_validation && corrections[1].corrector_validation) {
            if (corrections[1].finished_correc != 1) {
                let stat = await statCtrl.getStatByDiscordId(corrections[1].corrector_id)
                await statCtrl.updateStatCorrection(stat);
                await statCtrl.updatePendingCorrectionByStat(stat, -1);
                await this.updateFinishedCorrection(corrections[1].correc_id)
                await this.gainMana(message, corrector, 5)
                var score1 = await correcCtrl.getMark(day_id, corrections[1].corrector_id)

            }
        }
        if (score0 === undefined)
            score0 = 0;
        if (score1 === undefined)
            score1 = 0;
        corrections = await correcCtrl.getCorrectionsByDayId(day_id)
        if (corrections[0].finished_correc && corrections[1].finished_correc) {
            await dayCtrl.updateDayComplete(day_id)
            const stat = await statCtrl.getStatByDiscordId(corrections[0].corrected_id)
            await statCtrl.updateStatDaysDone(stat)
            const bestScore = score0 > score1 ? score0 : score1
            if (bestScore >= 35) {
                await dayCtrl.updateDayDone(day_id)
                await statCtrl.updateStatDaysDone(stat)
            }
            if (bestScore == 45) {
                await dayCtrl.updateDayOutstanding(day_id)
                await statCtrl.updateStatDaysOutstanding(stat)
            }
            await this.gainMana(message, corrected, bestScore)
        }
    },

    getCorrectionsByDayIdCorrectorCorrected : async function(dayId, corrector, corrected) {
        return await correcCtrl.getCorrectionsByDayIdCorrectorCorrected(dayId, corrector, corrected);
    },

    allwithMana : async function(message, month) {
        if (!month) {
            message.channel.send("please insert month")
            return ;
        }
        try {
            str = "login,mana\n"
            let user;
            let list = await Users.findAll()
            for (let i = 0; i < list.length; i++)
            {
                user = list[i]
                str += user.login + ',';
                let userStat = this.getStatByLogin(user.login)
                if (month == "june")
                    str += userStat.mana_june + "\n";
                else if (month == "july")
                    str += (userStat.mana - userStat.mana_june) + "\n";
            }
        } catch (e) {
            i.logs("ERROR : function All : " + e);
        }
        i.logs(str)
        fs.writeFile(month + '.csv', str, (err) => {
            if (err) throw err;
        })
    },

    printInfo : async function(message, login) {
        stat = await this.getStatByLogin(login);
        user = await this.getUserByLogin(login)
        currentDay = await this.getActualDayByUser(user)
        let str = "-----------------------------------------\n         __**" + login.toUpperCase() +
        " INFO SHEET**__\n-----------------------------------------\n\n" +
            "**Current day : " + currentDay.day_nb + "\n" +
        "Expected Mana : " + stat.mana + "**\n\n";
        str += await this.pendingCorrectInfoByUser(message, user);
        for (let i = 0; i < 5; i++) {
            dayId = await dayCtrl.getDayIdByStat(stat, i);
            day = await this.getDayByDayId(dayId);
            // corrections = await this.getCorrectionsByDayIdCorrectorCorrected()
            if (day.day_set) {
                str += "__**day0" + i + "**__ "
                if (day.corrected) {
                    if (day.outstanding_day) {
                        str += emoji.get('star') + "\n\n"
                    } else if (day.day_done) {
                        str += emoji.get('white_check_mark') + "\n\n"
                    } else {
                        str += emoji.get('x') + "\n\n"
                    }
                }
                let corrections = await correcCtrl.getCorrectionsByDayId(dayId)
                for (let j = 0; j < corrections.length; j++) {
                    if (!corrections[j].corrector_validation) {
                        let corrector = await this.getUserByDiscordId(corrections[j].corrector_id)
                        str += "\n> Missing " + corrector.login + " mark"
                    }
                    if (!corrections[j].corrected_validation) {
                        let corrected = await this.getUserByDiscordId(corrections[j].corrector_id)
                        str += "\n> Missing your validation for " + corrected.login + " correction"
                    }
                }
            }
        };
        message.channel.send(str);
    },

    printStatByDiscordId : async function(discord_id) {
        const stat = await statCtrl.getStatByDiscordId(discord_id);
        await this.printStat(stat);
    },

    printStatByDiscordIdInChannel : async function(message, discord_id, login) {
        const stat = await statCtrl.getStatByDiscordId(discord_id);
        await this.printStatInChannel(message, stat, login);
    },

    getRandomForCorrection : async  function(user){
        let list;
        list = await statCtrl.getStatsListWithMinCorrec(user);
        list = await shuffle(list);
        return await userCtrl.getUserByDiscordId(list[0].user_id);
    },

    printStatInChannel : async function (message, stat, login) {
        if (stat != null){
            let user = await this.getUserByLogin(login);
            let str;
            // message.channel.send(
            str ="```login           : " + login + "\n" +
            "is actif ?      : " + user.actif + "\n"+
            "days done       : " + stat.days_done + "\n" +
            "nb outstanding  : " + stat.days_outstanding + "\n" +
            "nb corrections  : " + stat.correction + "\n" +
            "pending correc  : " + stat.pending_correc + "\n" +
            "strike's life   : " + stat.strike + "\n" +
            "Day 0 id        : " + stat.day0_id + "\n" +
            "Day 1 id        : " + stat.day1_id + "\n" +
            "Day 2 id        : " + stat.day2_id + "\n" +
            "Day 3 id        : " + stat.day3_id + "\n" +
            "Day 4 id        : " + stat.day4_id + "\n";
            let day = await this.getDayByDayId(stat.day0_id);
            str+= await this.daysToString(day);
            day = await this.getDayByDayId(stat.day1_id);
            str+= await this.daysToString(day);
            day = await this.getDayByDayId(stat.day2_id);
            str+= await this.daysToString(day);
            day = await this.getDayByDayId(stat.day3_id);
            str+= await this.daysToString(day);
            day = await this.getDayByDayId(stat.day4_id);
            str+= await this.daysToString(day) + "``` \n";
            message.channel.send(str);
            await this.getCorrecInfoFromUser(message, user)
        }
    },

    updateStatDaysDone : async function (stat) {
        await statCtrl.updateStatDaysDone(stat);
    },

    updateStatCorrection : async function (stat) {
        await statCtrl.updateStatCorrection(stat)
    },

    getStatByLogin : async function (login){
        const user = await this.getUserByLogin(login)
        const stat = await statCtrl.getStatByUser(user)
        return (stat);
    },

    newDay: async function (User, nbDay) {
        const newDay = await dayCtrl.createDay(nbDay);
        await statCtrl.createDayInStat(User, nbDay, newDay);
    },

    getDayByDayId : async function(id_day){
        return dayCtrl.getDayByDayId(id_day);
    },

    getDayIdByStat : async function(stat, nb){
        return dayCtrl.getDayIdByStat(stat, nb);
    },

    getDayIdByUser : async function(user, nb){
        const stat = await statCtrl.getStatByUser(user);
        const day_id = await dayCtrl.getDayIdByStat(stat, nb);
        return (day_id);
    },

    daysToString : async function(day){
        const str = "----------" + "\n"
        + "day id          : " + day.day_id+ "\n"
        + "day nb          : " + day.day_nb+ "\n"
        + "set as finished : " + day.day_set+ "\n"
        + "corrected       : " + day.corrected+ "\n"
        + "validated       : " + day.day_done+ "\n"
        + "outstanding     : " + day.outstanding_day+ "\n";
        return str;
    },

    getCorrectionsByUsers : async function(corrector, corrected)
    {
      return await correcCtrl.getCorrectionsByUsers(corrector, corrected);
    },

    getCorrectionsNotDoneByUsers : async function(corrector, corrected)
    {
        return await correcCtrl.getCorrectionsNotDoneByUsers(corrector, corrected);
    },

    getAllCorrection : async function (){
        return await correcCtrl.getAllCorrection();
    },

    userGiveUpActivity : async function(user){
        await userCtrl.updateUserActivity(user, 0);
    },

    printAll : async function(message) {
      const List = await this.AllLogin();
      message.channel.send(List);
      message.channel.send("Total : " + List.length);

    },

    printAllAllActivity : async function(message) {
        const List = await this.AllLoginAllActivity();
        message.channel.send(List);
        message.channel.send("Total : " + List.length);
    },

    AllLogin : async function() {
        const List = await Users.findAll({where: {actif: 1}});
        return await List.map(t => t.dataValues.login);
    },

    AllLoginAllActivity : async function(){
        const List = await Users.findAll();
        return await List.map(t => t.dataValues.login);
    },

    asyncForEach: async function (array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    },

    sendInLoginChannel: function(login, str) {
        i.client.channels.cache.forEach(element => {
            if (element.name == "bootcamp-" + login) {
                element.send(str)
            }
        })
    },

    checkTimestamps : async function(correc){
        let now =  (new Date).getHours();
        let createdTime = (new Date(correc.createdAt)).getHours();
        if ((now - createdTime) > 24){
            return true
        }
        return false
    },

    missCorrector: async function(message, correction, missingUser, corrected) {
        if (correction.length === 1)
            correction = correction[0];
        else
            console.log("error missCorrector");

        if (await this.checkTimestamps(correction)){
            await this.setMissing(message, missingUser);
            const day =await dayCtrl.getDayByDayId(correction.day_id);
            await this.createCorrection(day, corrected);
            await correcCtrl.destroyCorrection(correction.correc_id);
        } else
            await this.error("you must wait 24h before report user", corrected);

    },

    destroyCorrection : async function(correc_id){
        const correc = await correcCtrl.getCorrectionByCorrecId(correc_id);
        const statCorrector = await statCtrl.getStatByDiscordId(correc.corrector_id);
        await statCtrl.updatePendingCorrectionByStat(statCorrector, -1);
        await correcCtrl.destroyCorrection(correc_id);
    },

    missCorrected: async function(message, correction, missingUser, corrector) {
        if (correction.length === 1)
            correction = correction[0];
        else
            console.log("error missCorrected");

        if (await this.checkTimestamps(correction)){
            await this.setMissing(missingUser);
            await this.destroyCorrection(correction.correc_id);
        } else
            await this.error("you must wait 24h before report user", corrected);
    },

    checkStrike : async function(stat){
        if (stat.strike <= 0)
            return true;
        return false;
    },

    //TODO modify str + unsubscribe user
    setMissing : async function(message, missingUser) {
        const stat = await statCtrl.getStatByUser(missingUser);
        let str;
        await statCtrl.updateStatStrikeDown(stat);
        if (await this.checkStrike(stat)) {
            //unsubscribe the missingUser
            str = "R.I.P in peace"
        } else {
            let i = stat.strike - 1
            str = "Someone says that you were missing for your correction, you still " + i + " warnings before be kicked from the bootcamp"
        }
        await this.sendInLoginChannel(missingUser.login, str);
    },

    nbOfPendingCorrection : async function(user) {
        const list = await correcCtrl.getCorrectionsNotDoneByUserAsCorrector(user);
        return list.length;
    },

    getStatByUser : async function(user) {
        return await statCtrl.getStatByUser(user)
    },

    createCorrection : async function(day, corrected){
        const corrector = await this.getRandomForCorrection(corrected);
        const statCorrector = await statCtrl.getStatByUser(corrector);
        await statCtrl.updatePendingCorrectionByStat(statCorrector, 1);
        const correction = await correcCtrl.createCorrection(day.day_id, corrector.discord_id, corrected.discord_id);
        await this.sendInLoginChannel(corrector.login, "<@" + corrector.discord_id + "> You will correct " + corrected.login + " on day " + day.day_nb)
    },

    correctedAnnouncement : async function(message, user){
        const correction = await correcCtrl.getCorrectionsNotDoneByUserAsCorrected(user)
        let corrector;
        let str = "";
        await this.asyncForEach(correction, async(element) => {
            corrector = await userCtrl.getUserByDiscordId(element.corrector_id)
           str += 'you wil be corrected by ' + corrector.login + "\n";
        })
        message.channel.send(str);
    },

    daySeted : async function(day) {
        await dayCtrl.updateDaySet(day.day_id, 1);
    },

    checkSetedDay : async function(day){
        if (day.day_set === 1) {
            return true;
        }
        return false;
    },

    getActualDayByUser : async function(user){
        const stat = await statCtrl.getStatByUser(user);
        let tab = [stat.day0_id, stat.day1_id, stat.day2_id, stat.day3_id, stat.day4_id];
        let result;
        await this.asyncForEach(tab, async (element) => {
            let day = await dayCtrl.getDayByDayId(element);
            if (day.corrected === 0 && result === undefined) {
                result = day;
            }
        })
        return result;
    },

    pendingCorrectInfoByUser : async function(message, user) {
        const correctorOn = await correcCtrl.getCorrectionsDoneByUserAsCorrector(user);
        const correctedOn = await correcCtrl.getCorrectionsNotDoneByUserAsCorrected(user);
        let str ="__**Pending Correction**__ : \n";
        await this.asyncForEach(correctorOn, async (element) =>{
            let corrected = (await userCtrl.getUserByDiscordId(element.corrected_id)).login;
            let nbDay = await this.getNbDayFromCorrec(element);
            str += "> You have to correct " + corrected + " on the day " + nbDay + "\n";
        })
        await this.asyncForEach(correctedOn, async (element) =>{
            let corrector = (await userCtrl.getUserByDiscordId(element.corrector_id)).login;
            let nbDay = await this.getNbDayFromCorrec(element);
            str += "> You have to be corrected by " + corrector + " on the day " + nbDay + "\n";
        })
        return str + "\n"
    },

    getCorrecInfoFromUser : async function(message, user){
        const stat = await statCtrl.getStatByUser(user);
        const tab = [stat.day0_id, stat.day1_id, stat.day2_id, stat.day3_id, stat.day4_id];
        for(const day_id of tab){
            for(const correc of (await correcCtrl.getCorrectionsByDayId(day_id))){
                 message.channel.send(await this.correcInfo(correc));
            }
        }
    },

    allCorrecInfo :  async function(message) {
        const correc = await correcCtrl.getAllCorrection();
        let str ="";
        await this.asyncForEach(correc, async (element) =>{
            str += await this.correcInfo(element);
        })
        message.channel.send(str);
    },

    correcInfo :  async function(correc) {
        let str ="";
        let corrected = (await userCtrl.getUserByDiscordId(correc.corrected_id)).login;
        let corrector = (await userCtrl.getUserByDiscordId(correc.corrector_id)).login;
        str += "```correc id           : " + correc.correc_id + '\n';
        str += "day id              : " + correc.day_id + '\n';
        str += "corrector id        : " + correc.corrector_id + '\n';
        str += "corrector name      : " + corrector + '\n';
        str += "corrected id        : " + correc.corrected_id + '\n';
        str += "corrected name      : " + corrected + '\n';
        str += "corrector check     : " + correc.corrector_validation + '\n';
        str += "corrected check     : " + correc.corrected_validation + '\n';
        str += "correction finished : " + correc.finished_correc + '\n';
        str += "validated           : " + correc.validated_correc + '\n';
        str += "outstanding         : " + correc.outstanding + '```';
        return str;
    },

    getNbDayFromCorrec : async function(correc) {
        const day = await dayCtrl.getDayByDayId(correc.day_id);
        return day.day_nb;
    },

    error : async function(str, user) {
        this.sendInLoginChannel(user.login, str)
        i.logs(str, user.login)
        console.log(str)
    },

    gainMana : async function(message, user, manaGain) {
        var d = new Date()
        stat = await this.getStatByUser(user)
        await statCtrl.updateStatMana(stat, manaGain)
        if (d.getMonth() == 6)
            await statCtrl.updateStatMana(stat, manaGain)
        stat = await this.getStatByUser(user)
        await this.sendInLoginChannel(user.login, "<@" + user.discord_id + "> You earned " + manaGain + ". You are now at " + stat.mana + " total mana")
    },

    getCorrectionsByDayIdCorrectorCorrected : async function(dayId, corrector, corrected) {
        return await correcCtrl.getCorrectionsByDayIdCorrectorCorrected(dayId, corrector, corrected);
    },

    resetAllUnsubscribedCorrections : async function(user){
        const correctionsAsCorrector = await correcCtrl.getCorrectionsNotDoneByUserAsCorrector(user);
        const correctionsAsCorrected = await correcCtrl.getCorrectionsNotDoneByUserAsCorrected(user);
        for (const correc of correctionsAsCorrector){
            let corrected = await userCtrl.getUserByDiscordId(correc.corrected_id);
            await this.createCorrection(correc, corrected);
            await correcCtrl.destroyCorrection(correc.correc_id)
        }
        for (const correc of correctionsAsCorrected){
            await correcCtrl.destroyCorrection(correc.correc_id);
        }
    },
}