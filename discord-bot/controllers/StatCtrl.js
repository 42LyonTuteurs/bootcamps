const { Users, Stat, Day } = require('../dbObject');
const userCtrl = require('./UsersCtrl');
const dayCtrl = require('./DayCtrl');

module.exports = {
    createStatByDiscordId : async function(discord_id) {
      await Stat.create({ user_id: discord_id});
    },

    createStatByUser : async function(User) {
        await  createStatByDiscordId(User.discord_id);
    },

    printStatByDiscordId : async function(discord_id) {
        const List = await Stat.findOne({where: {user_id: discord_id}});
        this.printStat(List);
    },

    printStatByUser : async function(User) {
        const List = await Stat.findOne({where: {user_id: user.discord_id}});
        this.printStat(List);
    },

    printStat : function (stat) {
        console.log("discord id     : " + stat.user_id);
        console.log("jours terminés : " + stat.days_done);
        console.log("nb corrections : " + stat.correction);
        console.log("nb corrigé     : " + stat.corrected);
        console.log("Day 0          : " + stat.day0_id);
        console.log("Day 1          : " + stat.day1_id);
        console.log("Day 2          : " + stat.day2_id);
        console.log("Day 3          : " + stat.day3_id);
        console.log("Day 4          : " + stat.day4_id);
    },

    updateDaysDone : async function (stat) {
        if (stat != null)
            stat.days_done++;
    },

    updateDay0Id : async function (stat, day) {
        if (day != null && stat != null)
            stat.day0_id = day.day_id;
    },

    updateDay1Id : async function (stat, day) {
        if (day != null && stat != null)
            stat.day1_id = day.day_id;
    },

    updateDay2Id : async function (stat, day) {
        if (day != null && stat != null)
            stat.day2_id = day.day_id;
    },

    updateDay3Id : async function (stat, day) {
        if (day != null && stat != null)
            stat.day3_id = day.day_id;
    },

    updateDay4Id : async function (stat, day) {
        if (day != null && stat != null)
            stat.day4_id = day.day_id;
    },

    updateCorrected : async function (stat) {
        if (stat != null)
            stat.corrected++;
    },

    updateCorrection : async function (stat) {
        if (stat != null)
            stat.correction++;
    },
}
