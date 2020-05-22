const utils = require('./utils.js');
const { Users, Stat, Day } = require('./dbObject');

module.exports = {
    forceCorrectionDone:  async function (login, nbDay) {
        const day = await utils.getDayByDayId(await utils.getDayIdByUser(await utils.getUserByLogin(login), nbDay));
        try {
            await Day.update({correction: 2}, {where: {day_id: day.day_id}});
        } catch (e) {
            utils.logs("ERROR : function forceCorrectionDone : " + e);
        }
    },

    forceCorrectedDone:  async function (login, nbDay) {
        const day = await utils.getDayByDayId(await utils.getDayIdByUser(await utils.getUserByLogin(login), nbDay));
        try {
            await Day.update({corrected: 2}, {where: {day_id: day.day_id}});
        } catch (e) {
            utils.logs("ERROR : function forceCorrectedDone : " + e);
        }
    },

    forceDayValidated : async function (login, nbDay) {
        const day = await utils.getDayByDayId(await utils.getDayIdByUser(await utils.getUserByLogin(login), nbDay));
        try {
            await Day.update({day_validated: 1}, {where: {day_id: day.day_id}});
        } catch (e) {
            utils.logs("ERROR : function forceCorrectedDone : " + e);
        }
    },

    forceDayComplete :async function (login, nbDay) {
        const day = await utils.getDayByDayId(await utils.getDayIdByUser(await utils.getUserByLogin(login), nbDay));
        try {
            await Day.update({day_complete: 1}, {where: {day_id: day.day_id}});
        } catch (e) {
            utils.logs("ERROR : function forceCorrectedDone : " + e);
        }
    },

    forceSetStatCorrection: async function (login) {
        console.log("login ==>" + login);
        const stat = await utils.getStatByLogin(login);
        try {
            await Stat.update({correction: stat.correction + 1}, {where: {user_id: stat.user_id}});
        } catch (e) {
            utils.logs("ERROR : function forceSetStatCorrection : " + e);
        }
    },

    forceSetStatCorrected: async function (login) {
        const stat = await utils.getStatByLogin(login);
        try {
            await Stat.update({corrected: stat.corrected + 1}, {where: {user_id: stat.user_id}});
        } catch (e) {
            utils.logs("ERROR : function forceSetStatCorrection : " + e);
        }
    },

    forceSetStatDaysDone: async function (login) {
        const stat = await utils.getStatByLogin(login);
        try {
            await Stat.update({days_done: stat.days_done + 1}, {where: {user_id: stat.user_id}});
        } catch (e) {
            utils.logs("ERROR : function forceSetStatCorrection : " + e);
        }
    },

    forceSetDayNull : async function(day){
        await Day.update({correction: 0, correction_send:0, who_correction:null, corrected:0, corrected_send:0, who_corrected:null, day_validated:0, day_complete:0}, {where: {day_id: day.day_id}});
    },

    forceSetAllDaysNull: async function(){
        let users = await utils.AllLogin();
        await utils.asyncForEach( users, async (element) => {
           let user = await utils.getUserByLogin(element);
           for (let i = 0; i < 5; i++) {
               let day_id = await utils.getDayIdByUser(user, i);
               let day = await utils.getDayByDayId(day_id);
               await this.forceSetDayNull(day);
           }
        })
    },

    forceSetSpecificDayNull: async function(nbDay){
        let users = await utils.AllLogin();
        await utils.asyncForEach( users, async (element) => {
            let user = await utils.getUserByLogin(element);
                let day_id = await utils.getDayIdByUser(user, nbDay);
                let day = await utils.getDayByDayId(day_id);
                await this.forceSetDayNull(day);
        })
    },
}