const {Stat, sequelize} = require('../dbObject');
const i = require('../index');
const Op = sequelize.Op;
const { QueryTypes } = require('sequelize');

module.exports = {

    createStatByDiscordId : async function(discord_id) {
        try {
            await Stat.create({ user_id: discord_id});
        } catch (e) {
            i.logs("ERROR : function createStatByDiscordId : " + e);
        }
    },

    getStatByUser : async function (user){
        try {
            const stat = await Stat.findOne({where: {user_id: user.discord_id}});
            return (stat);
        } catch (e) {
            i.logs("ERROR : function getStatByUser : " + e);
            return null;
        }
    },

    getStatByDiscordId : async function (discord_id){
        try {
            const stat = await Stat.findOne({where: {user_id: discord_id}});
            return (stat);
        } catch (e) {
            i.logs("ERROR : function getStatByUser : " + e);
            return null;
        }
    },

    createDayInStat : async function (User, nbDay, Day){
        try {
            if (nbDay == 0){
                await Stat.update({ day0_id: Day.day_id }, { where: { user_id: User.discord_id } });
            } else if (nbDay == 1){
                await Stat.update({ day1_id: Day.day_id }, { where: { user_id: User.discord_id } });
            } else if (nbDay == 2){
                await Stat.update({ day2_id: Day.day_id }, { where: { user_id: User.discord_id } });
            } else if (nbDay == 3){
                await Stat.update({ day3_id: Day.day_id }, { where: { user_id: User.discord_id } });
            } else if (nbDay == 4){
                await Stat.update({ day4_id: Day.day_id }, { where: { user_id: User.discord_id } });
            }
        } catch (e) {
            i.logs("ERROR : function createDayInStat : " + e);
        }

    },

    updateStatDaysDone : async function (stat) {
        if (stat != null)
            try{
                await Stat.update({ days_done: stat.days_done + 1 }, { where: { user_id: stat.user_id } });
            } catch (e) {
                i.logs("ERROR : function updateStatDaysDone : " + e);
            }
    },

    updateStatMana : async function (stat, gainMana) {
        if (stat != null)
            try{
                await Stat.update({ mana: stat.mana + gainMana }, { where: { user_id: stat.user_id } });
            } catch (e) {
                i.logs("ERROR : function updateStatMana: " + e);
            }
    },

    updateStatDaysOutstanding : async function (stat) {
        if (stat != null)
            try{
                await Stat.update({ days_outstanding: stat.days_outstanding + 1 }, { where: { user_id: stat.user_id } });
            } catch (e) {
                i.logs("ERROR : function updateStatDaysDone : " + e);
            }
    },

    updateStatCorrection : async function (stat) {
        if (stat != null)
            try{
                await Stat.update({ correction: stat.correction + 1 }, { where: { user_id: stat.user_id } });
            } catch (e) {
                i.logs("ERROR : function updateStatCorrection : " + e);
            }
    },

    getStatCorrection : async function(nbCorrection){
      try{
           return await Stat.findAll({where : {correction : nbCorrection}})
      }  catch (e) {
          i.logs("ERROR : function getStatMinCorrection : " + e);
      }
    },

    getStatCorrectionWithoutSpecificUser : async function(nbCorrection, user){
        try{
            return  await Stat.findAll({where : {correction : nbCorrection, user_id : { [Op.notLike] : user.discord_id}}});
        }  catch (e) {
            i.logs("ERROR : function getStatCorrectionWithoutSpecificUser : " + e);
        }
    },

    updateStatStrikeDown : async function(stat){
        try{
             await Stat.update({strike : stat.strike - 1  }, {where : { user_id : stat.user_id}})
        }  catch (e) {
            i.logs("ERROR : function getStatMinCorrection : " + e);
        }
    },

    getStatsListWithMinCorrec : async function(user){
        console.log("login 2 =>" + user.discord_id);
        try {
            // let ret = await sequelize.query(" SELECT * FROM stats WHERE (correction + pending_correc) = (select MIN (correction + pending_correc) from stats where user_id NOT LIKE '" + user.discord_id + "') AND user_id NOT LIKE '" + user.discord_id + "'AND (select actif FROM users_lists where actif = 1) GROUP BY user_id", { type: QueryTypes.SELECT });
            let ret = await sequelize.query(" SELECT * FROM stats WHERE (correction + pending_correc) = (select MIN (correction + pending_correc) from stats where user_id NOT LIKE '" + user.discord_id + "'  AND user_id in (select discord_id FROM users_lists WHERE actif = 1)) AND user_id NOT LIKE '" + user.discord_id + "' AND user_id in (select discord_id FROM users_lists WHERE actif = 1) GROUP BY user_id;", { type: QueryTypes.SELECT });
            return ret;
        } catch (e) {
                    i.logs("ERROR : function getStatMinCorrection : " + e);
        }
    },

    getAnotherStatsListWithMinCorrec : async function(user, user2){
        console.log("login 1 =>" + user.discord_id);
        try {
            let ret = await sequelize.query(" SELECT * FROM stats WHERE (correction + pending_correc) = (select MIN (correction + pending_correc) from stats where user_id NOT LIKE '" + user.discord_id + "' AND user_id NOT LIKE '" + user2.discord_id + "' AND user_id in (select discord_id FROM users_lists WHERE actif = 1)) AND user_id NOT LIKE '" + user.discord_id + "' AND user_id NOT LIKE '" + user2.discord_id + "'  AND user_id in (select discord_id FROM users_lists WHERE actif = 1) GROUP BY user_id", { type: QueryTypes.SELECT });
            console.log("prout")
            return ret;
        } catch (e) {
            i.logs("ERROR : function getStatMinCorrection : " + e);
        }
    },

    updatePendingCorrectionByStat : async function(stat, val){
      try {
          await Stat.update({pending_correc : stat.pending_correc + val},{where : {user_id : stat.user_id}});
      }  catch (e) {
          i.logs("ERROR : function updatePendingCorrectionByStat : " + e);
      }
    },
}