const configFile = require ('./config.json');
const config = configFile.botConfig;
const fs = require('fs');
const dateFormat = require('dateformat');
const { Users, Stat, Day } = require('./dbObject');
var emoji = require('node-emoji')

module.exports = {
    isAdmin(name) {
        return (config.admin.includes(name))
    },

    getRandomArbitrary(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    },

    alreadySubscribed(user) {
        //
    },

    logs(string, login)
    {
        var date = dateFormat();
        let output;
        if (login)
            output = date + " | " + login + "\n" + string + "\n\n";
        else
            output = date + " :\n" + string + "\n\n";
        fs.appendFile('app.log', output, (err) => {
            if (err) throw err;
        })
    },

    addUser: async function (discord_id, login) {
        try {
            await Users.create({discord_id: discord_id, login: login});
        } catch (e) {
            this.logs("ERROR : function addUser : " + e);
        }
        await this.createStatByDiscordId(discord_id);
        const user = await this.getUserByDiscordId(discord_id);
        for (let i = 0; i < 5; i++) {
            await this.createDay(user, i);
        }
    },

    printAllLogin : async function(){
        try {
            const List = await Users.findAll({attributes: ['login']});
            const ListString = List.map(t => t.login).join(' : ') || 'No tags set.';
            console.log(ListString);
        } catch (e) {
            this.logs("ERROR : function printAllLogin : " + e);
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

        // message.channel.send("```login          : " + user.login + "```");
        await this.printStatByDiscordIdInChannel(message, user.discord_id, user.login);
    },

    printUserInfoByUser: async function (user) {
        await this.printUserInfoByLogin(user.login);
    },

    getUserByLogin : async function(login){
        try {
            const user = await Users.findOne({where: {login: login}});
            return (user);
        } catch (e) {
            this.logs("ERROR : function getUserByLogin : " + e);
        };
    },

    getUserByDiscordId : async function(discord_id){
        try {
            const user = await Users.findOne({where: {discord_id: discord_id}});
            return (user);
        } catch (e) {
            this.logs("ERROR : function getUserByDiscordId : " + e);
        };
    },

    deleteUserByUser : async function(user){
        await this.deleteUserByLogin(user.login);
    },

    deleteUserByDiscordId : async function(discord_id){
        try {
            await Users.destroy({ where: { discord_id: discord_id } });
        } catch (e) {
            this.logs("ERROR : function deleteUserByDiscordId : " + e);
        };

    },

    deleteUserByLogin : async function(login){
        try {
            await Users.destroy({ where: { login: login } });
        } catch (e) {
            this.logs("ERROR : function deleteUserByLogin : " + e);
        };
    },

    All : async function() {
        try {
            const List = await Users.findAll();
            //console.log(List.map(t => t.dataValues));
            return List;
        } catch (e) {
            this.logs("ERROR : function All : " + e);
        };

    },

    allwithMana : async function(message) {
        try {
            str = "login,mana,daysdone\n"
            let user;
            let list = await this.allLoginAllActivity()
            for (user in list)
            {
                stat = await this.getStatByLogin(user.login)
                str += (user.login === lpieri ? cpieri : user.login) + "," + (stat.days_done * 40 > 200 ? 200 : stat.days_done * 40) + "," + stat.days_done + "\n"
            }
        } catch (e) {
            this.logs("ERROR : function All : " + e);
        }
        message.channel.send(str);
        fs.writeFile('mana.csv', str, (err) => {
            if (err) throw err;
        })
    },

    createStatByDiscordId : async function(discord_id) {
        try {
            await Stat.create({ user_id: discord_id});
        } catch (e) {
            this.logs("ERROR : function createStatByDiscordId : " + e);
        };
    },

    createStatByUser : async function(User) {
        await this.createStatByDiscordId(User.discord_id);
    },

    printInfo : async function(message, login) {
        stat = await this.getStatByLogin(login);
        str = "-----------------------------------------\n         __**" + login.toUpperCase() +
        " INFO SHEET**__\n-----------------------------------------\n\n" +
        "**Expected Mana** : " + stat.days_done * 40 + "\n\n";
        for (let i = 0; i < 5; i++) {
            str += await this.DayInfo(stat, i);
        };
        message.channel.send(str);
    },
    DayInfo : async function(stat, dayNb) {
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
    printStatByDiscordId : async function(discord_id) {
        const stat = await this.getStatByDiscordId(discord_id);
        await this.printStat(stat);
    },

    printStatByDiscordIdInChannel : async function(message, discord_id, login) {
        const stat = await this.getStatByDiscordId(discord_id);
        await this.printStatInChannel(message, stat, login);
    },

    printStatByUser : async function(user) {
        const stat = this.getStatByUser(user);
        this.printStat(stat);
    }, printStat : async function (stat) {
        if (stat != null){
            console.log("discord id     : " + stat.user_id);
            console.log("jours terminés : " + stat.days_done);
            console.log("nb corrections : " + stat.correction);
            console.log("nb corrigé     : " + stat.corrected);
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
            "nb corrections : " + stat.correction + "\n" +
            "nb corrigé     : " + stat.corrected + "\n" +
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
            str+= await this.daysToString(day) + "```";

            message.channel.send(str);
        }
    },

    updateStatDaysDone : async function (stat) {
        if (stat != null)
            try{
                await Stat.update({ days_done: stat.days_done + 1 }, { where: { user_id: stat.user_id } });
            } catch (e) {
                this.logs("ERROR : function updateStatDaysDone : " + e);
            }
    },

    updateStatCorrected : async function (stat) {
        if (stat != null)
            try{
                await Stat.update({ corrected: stat.corrected + 1 }, { where: { user_id: stat.user_id } });
            } catch (e) {
                this.logs("ERROR : function updateStatCorrected : " + e);
            }
    },

    updateStatCorrection : async function (stat) {
        if (stat != null)
            try{
                await Stat.update({ correction: stat.correction + 1 }, { where: { user_id: stat.user_id } });
            } catch (e) {
                this.logs("ERROR : function updateStatCorrection : " + e);
            }
    },

    getStatByUser : async function (user){
        try {
            const stat = await Stat.findOne({where: {user_id: user.discord_id}});
            return (stat);
        } catch (e) {
            this.logs("ERROR : function getStatByUser : " + e);
            return null;
        }
    },

    getStatByLogin : async function (login){
        const user = await this.getUserByLogin(login)
        const stat = await this.getStatByUser(user)
        return (stat);
    },

    getStatByDiscordId : async function (discord_id){
        const user = await this.getUserByDiscordId(discord_id)
        const stat = await this.getStatByUser(user)
        return (stat);
    },

    createDay: async function (User, nbDay) {
        try {
            const newDay = await Day.create({day_nb: nbDay});
            if (nbDay == 0){
                await Stat.update({ day0_id: newDay.day_id }, { where: { user_id: User.discord_id } });
            } else if (nbDay == 1){
                await Stat.update({ day1_id: newDay.day_id }, { where: { user_id: User.discord_id } });
            } else if (nbDay == 2){
                await Stat.update({ day2_id: newDay.day_id }, { where: { user_id: User.discord_id } });
            } else if (nbDay == 3){
                await Stat.update({ day3_id: newDay.day_id }, { where: { user_id: User.discord_id } });
            } else if (nbDay == 4){
                await Stat.update({ day4_id: newDay.day_id }, { where: { user_id: User.discord_id } });
            }
        } catch (e) {
            this.logs("ERROR : function createDay : " + e);
        }
    },

    getDayByDayId : async function(id_day){
        try {
            const day = await Day.findOne({where: {day_id: id_day}});
            return (day);
        } catch (e) {
            this.logs("ERROR : function getDayByDayId : " + e);
            return null;
        }

    },

    getDayIdByStat : async function(stat, nb){
        try {
            let day;
            let tab = [stat.day0_id, stat.day1_id, stat.day2_id, stat.day3_id, stat.day4_id];
            day = await Day.findOne({where: {day_id: tab[nb]}});
            return (day.day_id);
        } catch (e) {
            this.logs("ERROR : function getDayIdByStat : " + e);
            return null;
        }
    },

    getDayIdByUser : async function(user, nb){
        const stat = await this.getStatByUser(user);
        const day_id = await this.getDayIdByStat(stat, nb);
        return (day_id);
    },

    getActivityByUser : async function(login){
        let user = await Users.findOne({where: {login: login}});
        return (user.actif);
    },

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

    printDayByStat : async function(stat, nbDay){
        const day_id = this.getDayIdByStat(stat, nbDay);
        const day = await this.getDayByDayId(day_id)
        await this.printDay(day);
    },

    updateDayCorrection : async function(day){
        try {
            await Day.update({ correction: day.correction + 1 }, { where: { day_id: day.day_id } });
        } catch (e) {
            this.logs("ERROR : function updateDayCorrection : " + e);
        }
    },

    updateUserAtivity : async function(user){
        try {
            await Users.update({ actif: 0 }, { where: { discord_id: user.discord_id } });
        } catch (e) {
            this.logs("ERROR : function updateDayCorrection : " + e);
        }
    },

    updateDayWhoCorrection : async function(day, login){
        try {
            await Day.update({ who_correction: login }, { where: { day_id: day.day_id } });
        } catch (e) {
            this.logs("ERROR : function updateDayWhoCorrection : " + e);
        }
    },

    updateDayCorrected : async function(day){
        try {
            await Day.update({ corrected: day.corrected + 1 }, { where: { day_id: day.day_id } });
        } catch (e) {
            this.logs("ERROR : function updateDayCorrected : " + e);
        }
    },

    updateDayCorrectedSend : async function(day){
        try {
            await Day.update({ corrected_send: 1 }, { where: { day_id: day.day_id } });
        } catch (e) {
            this.logs("ERROR : function updateDayCorrected : " + e);
        }
    },

    updateDayCorrectionSend : async function(day){
        try {
            await Day.update({ correction_send: 1 }, { where: { day_id: day.day_id } });
        } catch (e) {
            this.logs("ERROR : function updateDayCorrected : " + e);
        }
    },

    updateDayValidated : async function(day, value){
        try {
            await Day.update({ day_validated: value }, { where: { day_id: day.day_id } });
        } catch (e) {
            this.logs("ERROR : function updateDayCorrected : " + e);
        }
    },


    updateDayWhoCorrected : async function(day, login){
        try {
            await Day.update({ who_corrected: login }, { where: { day_id: day.day_id } });
        } catch (e) {
            this.logs("ERROR : function updateDayWhoCorrected : " + e);
        }
    },

    updateDayComplete : async function(day){
        try {
            console.log(day);
            await Day.update({ day_complete: 1 }, { where: { day_id: day.day_id } });
        } catch (e) {
            this.logs("ERROR : function updateDayComplete : " + e);
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
    UserNb : async function() {
      const nbOfUsers = await Users.findAll();
      return (nbOfUsers.length)
    },

    AllLogin : async function() {
        const List = await Users.findAll({where: {actif: 1}});
        return await List.map(t => t.dataValues.login);
    },

    allLoginAllActivity : async function(){
        const List = await Users.findAll();
        return await List.map(t => t.dataValues.login);
    },

    asyncForEach: async function (array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    },
    AllData : async function(){
        const List = await Users.findAll();
        return await List.map(t => t.dataValues);
    },
}