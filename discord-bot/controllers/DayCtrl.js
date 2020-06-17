const {Day} = require('../dbObject');
const i = require('../index');

module.exports = {

    createDay: async function (User, nbDay) {
        try {
            return await Day.create({day_nb: nbDay});
        } catch (e) {
            i.logs("ERROR : function createDay : " + e);
        }
    },

    getDayByDayId : async function(id_day){
        try {
            const day = await Day.findOne({where: {day_id: id_day}});
            return (day);
        } catch (e) {
            i.logs("ERROR : function getDayByDayId : " + e);
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
            i.logs("ERROR : function getDayIdByStat : " + e);
            return null;
        }
    },

    updateDaySet : async function (day_id, val) {
            try{
                await Day.update({ day_set: val }, { where: { day_id: day_id } });
            } catch (e) {
                i.logs("ERROR : function updateDaySet : " + e);
            }
    },

    updateDayDone : async function (day_id) {
        try{
            await Day.update({ day_done: 1 }, { where: { day_id: day_id } });
        } catch (e) {
            i.logs("ERROR : function updateDayDone : " + e);
        }
    },

    updateDayOutstanding : async function (day_id) {
        try{
            await Day.update({ outstanding_day: 1 }, { where: { day_id: day_id } });
        } catch (e) {
            i.logs("ERROR : function updateDayOutstanding : " + e);
        }
    },
    updateDayOutstanding : async function (day_id) {
        try{
            await Day.update({ outstanding_day: 1 }, { where: { day_id: day_id } });
        } catch (e) {
            i.logs("ERROR : function updateDayOutstanding : " + e);
        }
    },
}
