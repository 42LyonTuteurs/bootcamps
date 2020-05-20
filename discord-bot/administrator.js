const utils = require('./utils.js');

async function forceCorrectionDone(login, nbDay){
    const day = await utils.getDayByDayId(await utils.getDayIdByUser(await utils.getUserByLogin(login), nbDay));
    try {
        await Day.update({ correction: 2 }, { where: { day_id: day.day_id } });
    } catch (e) {
        this.logs("ERROR : function forceCorrectionDone : " + e);
    }
}

async function forceCorrectedDone(login, nbDay){
    const day = await utils.getDayByDayId(await utils.getDayIdByUser(await utils.getUserByLogin(login), nbDay));
    try {
        await Day.update({ corrected: 2 }, { where: { day_id: day.day_id } });
    } catch (e) {
        this.logs("ERROR : function forceCorrectedDone : " + e);
    }
}

async function forceDayValidated(login, nbDay){
    const day = await utils.getDayByDayId(await utils.getDayIdByUser(await utils.getUserByLogin(login), nbDay));
    try {
        await Day.update({ day_validated: 1 }, { where: { day_id: day.day_id } });
    } catch (e) {
        this.logs("ERROR : function forceCorrectedDone : " + e);
    }
}

async function forceDayComplete(login, nbDay){
    const day = await utils.getDayByDayId(await utils.getDayIdByUser(await utils.getUserByLogin(login), nbDay));
    try {
        await Day.update({ day_complete: 1 }, { where: { day_id: day.day_id } });
    } catch (e) {
        this.logs("ERROR : function forceCorrectedDone : " + e);
    }
}

async function forceSetStatCorrection(login){
    const stat = utils.getStatByLogin(login);
    try {
        await stat.update({ correction: stat.correction + 1 }, { where: { user_id: stat.user_id } });
    } catch (e) {
        this.logs("ERROR : function forceSetStatCorrection : " + e);
    }
}

async function forceSetStatCorrected(login){
    const stat = utils.getStatByLogin(login);
    try {
        await stat.update({ corrected: stat.corrected + 1 }, { where: { user_id: stat.user_id } });
    } catch (e) {
        this.logs("ERROR : function forceSetStatCorrection : " + e);
    }
}

async function forceSetStatDaysDone(login){
    const stat = utils.getStatByLogin(login);
    try {
        await stat.update({ days_done: stat.days_done + 1 }, { where: { user_id: stat.user_id } });
    } catch (e) {
        this.logs("ERROR : function forceSetStatCorrection : " + e);
    }
}