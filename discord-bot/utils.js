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

    // getRandomArbitrary(min, max) {
    //     return Math.round(Math.random() * (max - min) + min);
    // },
    //
    // alreadySubscribed(user) {
    //     //
    // },
    addUser: async function (discord_id, login) {
        await userCtrl.createUser(discord_id, login);
        await statCtrl.createStatByDiscordId(discord_id);
        const user = await this.getUserByDiscordId(discord_id);
        for (let i = 0; i < 5; i++) {
            await this.newDay(user, i);
        }
    },
    //
    // printAllLogin : async function(){
    //     try {
    //         const List = await Users.findAll({attributes: ['login']});
    //         const ListString = List.map(t => t.login).join(' : ') || 'No tags set.';
    //         console.log(ListString);
    //     } catch (e) {
    //         i.logs("ERROR : function printAllLogin : " + e);
    //     }
    // },

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

        // message.channel.send("```login          : " + user.login + "```");
        await this.printStatByDiscordIdInChannel(message, user.discord_id, user.login);
    },

    // printUserInfoByUser: async function (user) {
    //     await this.printUserInfoByLogin(user.login);
    // },

    getUserByLogin : async function(login){
        return await userCtrl.getUserByLogin(login);
    },


    getUserByDiscordId : async function(discord_id){
        return await userCtrl.getUserByDiscordId(discord_id);
    },


    updateCorrectedValidation : async function(day_id) {
        return await correcCtrl.updateCorrectedValidation(day_id)
    },
    updateFinishedCorrection : async function(day_id) {
        return await correcCtrl.updateFinishedCorrection(day_id)
    },
    updateCorrectorValidation : async function(day_id) {
        return await correcCtrl.updateCorrectorValidation(day_id)
    },
    updateValidatedCorrection : async function(day_id) {
        return await correcCtrl.updateValidatedCorrection(day_id)
    },
    updateOutstanding : async function(day_id) {
        return await correcCtrl.updateOutstanding(day_id)
    },
    checkDayFinished : async function(message, day_id, corrector, corrected) {
        let corrections = await correcCtrl.getCorrectionsByDayId(day_id)
        if (corrections[0].corrected_validation && corrections[0].corrector_validation) {
            if (corrections[0].finished_correc != 1) {
                await this.updateFinishedCorrection(day_id)
                await this.gainMana(message, corrector, 5)
                var score0 = await correcCtrl.getMark(day_id, corrections[0].corrector_id)
            }
        }
        if (corrections[1].corrected_validation && corrections[1].corrector_validation) {
            if (corrections[1].finished_correc != 1) {
                await this.updateFinishedCorrection(day_id)
                await this.gainMana(message, corrector, 5)
                var score1 = await correcCtrl.getMark(day_id, corrections[1].corrector_id)
            }
        }

        corrections = await correcCtrl.getCorrectionsByDayId(day_id)
        if (corrections[0].finished_correc && corrections[1].finished_correc) {
            let day = await this.getDayByDayId(day_id)
            await this.updateDayComplete(day)
            bestScore = score0 > score1 ? score0 : score1
            console.log("best score : " + bestScore)
            if (bestScore >= 35)
                await dayCtrl.updateDayDone(day_id)
            if (bestScore == 45)
                await dayCtrl.updateDayOutstanding(day_id)
            await this.gainMana(message, corrected, bestScore)
        }
    },
    getCorrectionsByDayIdCorrectorCorrected : async function(dayId, corrector, corrected) {
        return await correcCtrl.getCorrectionsByDayIdCorrectorCorrected(dayId, corrector, corrected);
    },

    // checkDayCorrected : async function(message, user) {
    //
    // },
    //CHECK ------------------------------------------------------------
    // All : async function() {
    //     try {
    //         const List = await Users.findAll();
    //         //console.log(List.map(t => t.dataValues));
    //         return List;
    //     } catch (e) {
    //         i.logs("ERROR : function All : " + e);
    //     }
    //
    // },

    allwithMana : async function(message, month) {
        // message.channel.send()
        if (!month) {
            message.channel.send("please insert month")
            return ;
        }
        try {
            str = "login,mana\n"
            let user;
            let list = await Users.findAll()
            console.log(list.length)
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

    // createStatByDiscordId : async function(discord_id) {
    //     try {
    //         await Stat.create({ user_id: discord_id});
    //     } catch (e) {
    //         i.logs("ERROR : function createStatByDiscordId : " + e);
    //     };
    // },


    printInfo : async function(message, login) {
        stat = await this.getStatByLogin(login);
        user = await this.getUserByLogin(login)
        str = "-----------------------------------------\n         __**" + login.toUpperCase() +
        " INFO SHEET**__\n-----------------------------------------\n\n" +
        "**Expected Mana** : " + stat.mana + "\n\n";
        str += await this.pendingCorrectInfoByUser(message, user);
        // for (let i = 0; i < 1; i++) {
        //     str += await this.DayInfo(stat, i, user);
        // };
        message.channel.send(str);
    },


    //deprecated
    OldDayInfo : async function(stat, dayNb) {
        dayId = await this.getDayIdByStat(stat, dayNb);
        day = await this.getDayByDayId(dayId);
        if (day.who_corrected == null)
            return "";
        str = "*Day0" + dayNb + "* : ";
        if (day.complete == 1)
            str += emoji.get('white_check_mark');
        else
            str += emoji.get('x');
        str += "\nValidates " + day.who_correction + " ";
        if (day.correction == 2)
            str += emoji.get('white_check_mark');
        else
            str += emoji.get('x');
        str += " (" + day.correction + "/2)\n" +
        "Corrected by " + day.who_corrected + " ";
        if (day.corrected == 2)
            str += emoji.get('white_check_mark');
        else
            str += emoji.get('x');
        str += " (" + day.corrected + "/2)\n\n";
        return str;
    },

    DayInfo : async function(stat, dayNb, user) {
        dayId = await dayCtrl.getDayIdByStat(stat, dayNb);
        console.log(`Day ID\t: ${dayId}`)
        let corrections = await correcCtrl.getDayCorrections(dayId, user)
        for (const correction in corrections) {
            this.printCorrection(correction);
        }
        // if (dayId == null)
        //     return "";
        // day = await this.getDayByDayId(dayId);
        // console.log(day)
        // if (day == null || day.who_corrected == null) {
        //     console.log("RIP")
        //     return "";
        // }
        // str = "*Day" + dayNb + "* : ";
        // if (day.day_done == 2)
        //     str += emoji.get('white_check_mark');
        // else
        //     str += emoji.get('x');
        // if (day.outstanding_day == 2)
        //     str += emoji.get('white_check_mark');
        // str += "\nValidates " + day.who_correction + " ";
        // if (day.correction == 2)
        //     str += emoji.get('white_check_mark');
        // else
        //     str += emoji.get('x');
        // str += " (" + day.correction + "/2)\n" +
        //     "Corrected by " + day.who_corrected + " ";
        // if (day.corrected == 2)
        //     str += emoji.get('white_check_mark');
        // else
        //     str += emoji.get('x');
        // str += " (" + day.corrected + "/2)\n\n";
        // console.log(str)
        return str;
    },

    printCorrection : async function(correction) {
        console.log(correction)
    },

    createNewCorrectionByDiscordId : async function(day, corrected_id, corrector_id) {
        await correcCtrl.createCorrection(day.day_id, corrector_id, corrected_id);
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
        let nbCorrection = 0;
        while (list === undefined || list.length === 0){
            list = await statCtrl.getStatCorrectionWithoutSpecificUser(nbCorrection , user);
            nbCorrection++;
            console.log(" yes nb correction " + nbCorrection);
        }
        // console.log(list);
        console.log("ici " + list.length + " ici");
        list = await this.getUserWithMinPendingCorrection(list);
        console.log("ici " + list.length + " ici");

        list = await shuffle(list);
        console.log("ici " + list.length + " ici");

        return await userCtrl.getUserByDiscordId(list[0].dataValues.discord_id);
    },

    getUserWithMinPendingCorrection : async function(stats){
        let list = [];
        let index = 0
        let nb_user = 0;
        while ((list === undefined || list.length === 0)){
            await this.asyncForEach(stats, async (element) =>{
                let user = await userCtrl.getUserByDiscordId(element.user_id)
                // console.log(user);
                if (await this.nbOfPendingCorrection(user) === index) {
                    list[nb_user] = user;
                    nb_user++;
                }
            })
            index++;
            console.log("oui");
        }
        return list;
    },

    printStatByUser : async function(user) {
        const stat = statCtrl.getStatByUser(user);
        this.printStat(stat);
    },

    printStat : async function (stat) {
        if (stat != null){
            console.log("discord id     : " + stat.user_id);
            console.log("jours terminés : " + stat.days_done);
            console.log("jours outstanding : " + stat.days_outstanding);
            console.log("nb corrections : " + stat.correction);
            // console.log("nb corrigé     : " + stat.corrected);
            console.log("Day 0          : " + stat.day0_id);
            console.log("Day 1          : " + stat.day1_id);
            console.log("Day 2          : " + stat.day2_id);
            console.log("Day 3          : " + stat.day3_id);
            console.log("Day 4          : " + stat.day4_id);
            let day = await this.getDayByDayId(stat.day0_id);
            this.printDay(day);
            day = await this.getDayByDayId(stat.day1_id);
            this.printDay(day);
            day = await this.getDayByDayId(stat.day2_id);
            this.printDay(day);
            day = await this.getDayByDayId(stat.day3_id);
            this.printDay(day);
            day = await this.getDayByDayId(stat.day4_id);
            this.printDay(day);
        }
    },

    printStatInChannel : async function (message, stat, login) {
        if (stat != null){
            let user = await this.getUserByLogin(login);
            let str;
            // message.channel.send(
            str ="```login          : " + login + "\n" +
            "is actif ?     : " + user.actif + "\n"+
            "jours terminés : " + stat.days_done + "\n" +
            "jours outstanding : " + stat.days_outstanding + "\n" +
            "nb corrections : " + stat.correction + "\n" +
            // "nb corrigé     : " + stat.corrected + "\n" +
            "Day 0          : " + stat.day0_id + "\n" +
            "Day 1          : " + stat.day1_id + "\n" +
            "Day 2          : " + stat.day2_id + "\n" +
            "Day 3          : " + stat.day3_id + "\n" +
            "Day 4          : " + stat.day4_id + "\n";
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

    //deprecated
    updateStatCorrected : async function (stat) {
        if (stat != null)
            try{
                await Stat.update({ corrected: stat.corrected + 1 }, { where: { user_id: stat.user_id } });
            } catch (e) {
                i.logs("ERROR : function updateStatCorrected : " + e);
            }
    },

    updateStatCorrection : async function (stat) {
        await statCtrl.updateStatCorrection(stat)
    },

    // getStatByUser : async function (user){
    //     try {
    //         const stat = await Stat.findOne({where: {user_id: user.discord_id}});
    //         return (stat);
    //     } catch (e) {
    //         i.logs("ERROR : function getStatByUser : " + e);
    //         return null;
    //     }
    // },

    getStatByLogin : async function (login){
        const user = await this.getUserByLogin(login)
        const stat = await statCtrl.getStatByUser(user)
        return (stat);
    },

    // getStatByDiscordId : async function (discord_id){
    //     const user = await this.getUserByDiscordId(discord_id)
    //     const stat = await statCtrl.getStatByUser(user)
    //     return (stat);
    // },

    // createDay: async function (User, nbDay) {
    //     try {
    //         const newDay = await Day.create({day_nb: nbDay});
    //         if (nbDay == 0){
    //             await Stat.update({ day0_id: newDay.day_id }, { where: { user_id: User.discord_id } });
    //         } else if (nbDay == 1){
    //             await Stat.update({ day1_id: newDay.day_id }, { where: { user_id: User.discord_id } });
    //         } else if (nbDay == 2){
    //             await Stat.update({ day2_id: newDay.day_id }, { where: { user_id: User.discord_id } });
    //         } else if (nbDay == 3){
    //             await Stat.update({ day3_id: newDay.day_id }, { where: { user_id: User.discord_id } });
    //         } else if (nbDay == 4){
    //             await Stat.update({ day4_id: newDay.day_id }, { where: { user_id: User.discord_id } });
    //         }
    //     } catch (e) {
    //         i.logs("ERROR : function createDay : " + e);
    //     }
    // },

    newDay: async function (User, nbDay) {
        const newDay = await dayCtrl.createDay();
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

    // getActivityByUser : async function(login){
    //     let user = await Users.findOne({where: {login: login}});
    //     return (user.actif);
    // },

    //deprecated
    printDay : async function(day){
        if (day != null) {
            console.log("----------");
            console.log("day id         : " + day.day_id);
            console.log("day nb         : " + day.day_nb);
            console.log("correction     : " + day.correction);
            console.log("correction on  : " + day.who_correction);
            console.log("corrected      : " + day.corrected);
            console.log("corrected by   : " + day.who_corrected);
            console.log("day complete   : " + day.day_complete);
        }
    },

    //deprecated
    daysToString : async function(day){
        const str = "----------" + "\n"
        + "day id         : " + day.day_id+ "\n"
        + "day nb         : " + day.day_nb+ "\n"
        + "correction     : " + day.correction+ "\n"
        + "correction on  : " + day.who_correction+ "\n"
        + "corrected      : " + day.corrected+ "\n"
        + "corrected by   : " + day.who_corrected+ "\n"
        + "day complete   : " + day.day_complete+ "\n"
        + "correction send: " + day.correction_send+ "\n"
        + "corrected send : " + day.corrected_send+ "\n"
        + "validate day   : " + day.day_validated+ "\n";
        return str;
    },

    // printDayByStat : async function(stat, nbDay){
    //     const day_id = dayCtrl.getDayIdByStat(stat, nbDay);
    //     const day = await dayCtrl.getDayByDayId(day_id)
    //     await this.printDay(day);
    // },


    //TODO NEW
    // CorrectionsNotDone : async function(user){
    //     const stat = await statCtrl.getStatByUser(user);
    //     const listNotfinished = await correcCtrl.getCorrectionsNotDoneByCorrector(user.discord_id);
    //     console.log(listNotfinished)
    //     return listNotfinished;
    // },

    //NEW
    CheckCorrectionStatus : async function(correc){
        if (correc.corrected_validation === 1  && correc.corrector_validation === 1)
            return true;
        return false;
    },

    getCorrectionsByUsers : async function(corrector, corrected)
    {
      return await correcCtrl.getCorrectionsByUsers(corrector, corrected);
    },

    getCorrectionsNotDoneByUsers : async function(corrector, corrected)
    {
        return await correcCtrl.getCorrectionsNotDoneByUsers(corrector, corrected);
    },

    getAllCorrectionFromUser : async function(user){
        let tab = {};
        tab.append(await correcCtrl.getAllCorrectionsByUserAsCorrected(user))
        tab.append(await correcCtrl.getAllCorrectionsByUserAsCorrector(user))
        return tab
    },

    getAllCorrection : async function (){
        return await correcCtrl.getAllCorrection();
    },

    // deprecated
    updateDayCorrection : async function(day){
        try {
            await Day.update({ correction: day.correction + 1 }, { where: { day_id: day.day_id } });
        } catch (e) {
            i.logs("ERROR : function updateDayCorrection : " + e);
        }
    },

    // updateUserAtivity : async function(user){
    //     try {
    //         await Users.update({ actif: 0 }, { where: { discord_id: user.discord_id } });
    //     } catch (e) {
    //         i.logs("ERROR : function updateDayCorrection : " + e);
    //     }
    // },

    userGiveUpActivity : async function(user){
        await userCtrl.updateUserActivity(user, 0);
    },


    //deprecated
    updateDayWhoCorrection : async function(day, login){
        try {
            await Day.update({ who_correction: login }, { where: { day_id: day.day_id } });
        } catch (e) {
            i.logs("ERROR : function updateDayWhoCorrection : " + e);
        }
    },


    //deprecated
    updateDayCorrected : async function(day){
        try {
            await Day.update({ corrected: day.corrected + 1 }, { where: { day_id: day.day_id } });
        } catch (e) {
            i.logs("ERROR : function updateDayCorrected : " + e);
        }
    },


    //deprecated
    updateDayCorrectedSend : async function(day){
        try {
            await Day.update({ corrected_send: 1 }, { where: { day_id: day.day_id } });
        } catch (e) {
            i.logs("ERROR : function updateDayCorrected : " + e);
        }
    },


    //deprecated
    updateDayCorrectionSend : async function(day){
        try {
            await Day.update({ correction_send: 1 }, { where: { day_id: day.day_id } });
        } catch (e) {
            i.logs("ERROR : function updateDayCorrected : " + e);
        }
    },


    //deprecated
    updateDayValidated : async function(day, value){
        try {
            await Day.update({ day_validated: value }, { where: { day_id: day.day_id } });
        } catch (e) {
            i.logs("ERROR : function updateDayCorrected : " + e);
        }
    },

    //deprecated
    updateDayWhoCorrected : async function(day, login){
        try {
            await Day.update({ who_corrected: login }, { where: { day_id: day.day_id } });
        } catch (e) {
            i.logs("ERROR : function updateDayWhoCorrected : " + e);
        }
    },

    //deprecated
    updateDayComplete : async function(day){
        try {
            console.log(day);
            await Day.update({ day_complete: 1 }, { where: { day_id: day.day_id } });
        } catch (e) {
            i.logs("ERROR : function updateDayComplete : " + e);
        }
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
    //
    // UserNb : async function() {
    //   const nbOfUsers = await Users.findAll();
    //   return (nbOfUsers.length)
    // },

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

    //TODO only modify console.log => message to channel
    missCorrector: async function(message, correction, missingUser, corrected) {
        if (correction.length === 1)
            correction = correction[0];
        else
            console.log("TODO");

        // if (await this.checkTimestamps(correction)){
            await this.setMissing(message, missingUser);
            const day =await dayCtrl.getDayByDayId(correction.day_id);
            await this.createCorrection(day, corrected);
            await correcCtrl.destroyCorrection(correction.correc_id);
        // } else
        //     console.log("tu dois attendre 24h mec");

    },

    //TODO only modify console.log => message to channel
    missCorrected: async function(message, correction, missingUser, corrector) {
        if (correction.length === 1)
            correction = correction[0];
        else
            console.log("TODO");

        if (await this.checkTimestamps(correction)){
            await this.setMissing(missingUser);
            await this.deleteCorrection(correction);
        } else
            console.log("tu dois attendre 24h mec");

    },

    checkStrike : async function(stat){
        if (stat.strike <= 0)
            return true;
        return false;
    },

    //TODO only modify str
    setMissing : async function(message, missingUser) {
        const stat = await statCtrl.getStatByUser(missingUser);
        let str;
        await statCtrl.updateStatStrikeDown(stat);
        if (await this.checkStrike(stat)) {
            //unsubscribe the missingUser
            str = "R.I.P in peace"
        } else {
            str = "Someone says that you were missing for your correction, you still " + stat.strike - 1 + " warnings before be kicked from the bootcamp"
        }
        await this.sendInLoginChannel(missingUser.login, str);
    },

    //
    // resetCorrection : async function(correc, User) {
    //     //
    //     //    # This function set another correction for the user argument
    //     //delete old correction
    //     const day = dayCtrl.getDayByDayId(correc.day_id);
    //     const newCorrector = await this.getRandomForCorrection();
    //     await this.deleteCorrection(correc);
    //     // await this.createNewCorrectionByDiscordId(day.day_nb, User.discord_id, newCorrector.discord_id);
    // },

    //TODO
    deleteCorrection : async function(correc){
        await correcCtrl.destroyCorrection(correc.correc_id)
    },

    AllData : async function() {
        const List = await Users.findAll();
        return await List.map(t => t.dataValues);
    },

    nbOfPendingCorrection : async function(user) {
        const list = await correcCtrl.getAllCorrectionsByUserAsCorrector(user);
        return list.length;
    },

    getStatByUser : async function(user) {
        return await statCtrl.getStatByUser(user)
    },

    getDayByUserAndNbDay : async function(user, nbDay) {
        const day_id = await this.getDayIdByUser(user, nbDay);
        return await dayCtrl.getDayByDayId(day_id);
    },

    createCorrection : async function(day, corrected){
        const corrector = await this.getRandomForCorrection(corrected);
        await correcCtrl.createCorrection(day.day_id, corrector.discord_id, corrected.discord_id);
    },

    correctedAnnouncement : async function(message, user){
        const correction = await correcCtrl.getCorrectionsNotDoneByUserAsCorrected(user)
        // const channel = await this.getLoginChannel(message, user.login)
        let corrector;
        let str = "";
        await this.asyncForEach(correction, async(element) => {
            corrector = await userCtrl.getUserByDiscordId(element.corrector_id)
            // console.log(corrector);
           str += 'you wil be corrected by ' + corrector.login + "\n";
        })
        console.log(str)
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
            // console.log(element);
            let day = await dayCtrl.getDayByDayId(element);
            // console.log(day);
            if (day.day_done === 0 && result === undefined) {
                console.log("oui mosieur");
                result = day;
            }
        })
        return result;
    },

    correctInfoByUser : async function(message, user) {
        const correctorOn = await correcCtrl.getAllCorrectionsByUserAsCorrector(user);
        const correctedOn = await correcCtrl.getAllCorrectionsByUserAsCorrected(user);
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
        return str
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
        return str
    },

    getCorrecInfoFromUser : async function(message, user){
        const stat = await statCtrl.getStatByUser(user);
        const tab = [stat.day0_id, stat.day1_id, stat.day2_id, stat.day3_id, stat.day4_id];
        for(const day_id of tab){
            console.log(day_id)
            for(const correc of (await correcCtrl.getCorrectionsByDayId(day_id))){
                console.log(correc)
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
        console.log("correc =>")
        console.log(correc)
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
}