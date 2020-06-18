const {Correc} = require('../dbObject');
const { Op } = require("sequelize");
const i = require('../index');

module.exports = {
    createCorrection : async function(day_id, corrector_id, corrected_id) {
        try {
            await Correc.create({ day_id: day_id, corrector_id: corrector_id, corrected_id: corrected_id});
        } catch (e) {
            i.logs("ERROR : function createCorrection : " + e);
        }
    },

    getCorrectionsNotDoneByUsers : async function(corrector, corrected){
        try{
            return await Correc.findAll({where : {finished_correc: 0, corrector_id: corrector.discord_id, corrected_id: corrected.discord_id}})
        } catch (e) {
            i.logs("ERROR : function getCorrectionsNotDoneByCorrector : " + e);
        }
    },

    getCorrectionsByUsers : async function(corrector, corrected) {
        try {
            return await Correc.findAll({where : {corrector_id: corrector.discord_id, corrected_id: corrected.discord_id}});
        } catch (e) {
            i.logs("ERROR : function getCorrectionsByUsers : " + e);
        }
    },

    getCorrectionsNotDoneByUserAsCorrector : async function(user){
        try{
            return await Correc.findAll({where : {corrector_validation: 0, corrector_id: user.discord_id}})
        } catch (e) {
            i.logs("ERROR : function getCorrectionsNotDoneByCorrector : " + e);
        }
    },

    getCorrectionsNotDoneByUserAsCorrected : async function(user){
        try{
            return await Correc.findAll({where : {corrected_validation: 0, corrected_id: user.discord_id}})
        } catch (e) {
            i.logs("ERROR : function getCorrectionsNotDoneByCorrector : " + e);
        }
    },

    getCorrectionsDoneByUserAsCorrector : async function(user){
        try{
            return await Correc.findAll({where : {corrector_validation: 0, corrector_id: user.discord_id}})
        } catch (e) {
            i.logs("ERROR : function getCorrectionsNotDoneByCorrector : " + e);
        }
    },

    getCorrectionsDoneByUserAsCorrected : async function(user){
        try{
            return await Correc.findAll({where : {corrected_validation: 1, corrected_id: user.discord_id}})
        } catch (e) {
            i.logs("ERROR : function getCorrectionsNotDoneByCorrector : " + e);
        }
    },

    getAllCorrectionsByUserAsCorrected : async function(user) {
        try{
            return await Correc.findAll({where : {corrected_id: user.discord_id}})
        } catch (e) {
            i.logs("ERROR : function getAllCorrectionsByUserAsCorrected : " + e);
        }
    },

    getAllCorrectionsByUserAsCorrector : async function(user) {
        try{
            return await Correc.findAll({where : {corrector_id: user.discord_id}})
        } catch (e) {
            i.logs("ERROR : function getAllCorrectionsByUserAsCorrector : " + e);
        }
    },

    getAllCorrection : async function() {
        try {
            return await Correc.findAll();

        } catch (e) {
            i.logs("ERROR : function getCorrectionsByUsers : " + e);
        }
    },

    getDayCorrections : async function(dayId, user) {
        try {
            return await Correc.findAll({where: {
                    day_id: dayId,
                    corrected_id: user.discord_id,
                    [Op.or]: [{corrector_validation}, {corrected_validation}]

                }})
        } catch (e) {
            i.logs("ERROR : function getCorrectionByDayId : " + e);
        }
    },

    getCorrectionByDayIdAndCorrector : async function(dayId, corrector) {
        try {
            return await Correc.findOne({
                where : {
                    corrector_id: corrector.discord_id,
                    day_id: dayId
                }
            })
        } catch (e) {
            i.logs("ERROR : function getCorrectionByDayId : " + e);
        }

    },

    getCorrectionsByDayId : async function(dayId) {
        try {
            return await Correc.findAll({
                where : {
                    day_id: dayId
                }
            })
        } catch (e) {
            i.logs("ERROR : function getCorrectionByDayId : " + e);
        }

    },

    getCorrectionsByDayIdCorrectorCorrected : async function(dayId, corrector, corrected) {
        try {
            return await Correc.findOne({
                where : {
                    day_id: dayId,
                    corrected_id : corrected.discord_id,
                    corrector_id : corrector.discord_id,
                }
            })
        } catch (e) {
            i.logs("ERROR : function getCorrectionsByDayIdCorrectorCorrected : " + e);
        }

    },

    getCorrectionByCorrector : async function() {

    },

    //no necessary
    getCorrectionByCorrecId : async function(correc_id) {
        try {
            return await Correc.findOne({where : {correc_id: correc_id}});
        } catch (e) {
            i.logs("ERROR : function getCorrectionByCorrecId : " + e);
        }
    },


    updateCorrectorValidation : async function(day_id) {
        try {
            await Correc.update({ corrector_validation: 1}, {where : {day_id : day_id}});
        } catch (e) {
            i.logs("ERROR : function updateCorrectorValidation : " + e);
        }
    },

    updateCorrectedValidation : async function(day_id) {
        try {
            await Correc.update({ corrected_validation: 1}, {where : {day_id : day_id}});
        } catch (e) {
            i.logs("ERROR : function updateCorrectedValidation : " + e);
        }
    },

    updateFinishedCorrection : async function(day_id) {
        try {
            await Correc.update({ finished_correc: 1}, {where : {day_id : day_id}});
        } catch (e) {
            i.logs("ERROR : function updateValidatedCorrection : " + e);
        }
    },

    updateValidatedCorrection : async function(day_id) {
        try {
            await Correc.update({ validated_correc: 1}, {where : {day_id : day_id}});
        } catch (e) {
            i.logs("ERROR : function updateValidatedCorrection : " + e);
        }
    },

    updateOutstanding : async function(day_id) {
        try {
            await Correc.update({ outstanding: 1}, {where : {day_id : day_id}});
        } catch (e) {
            i.logs("ERROR : function updateOutstanding : " + e);
        }
    },

    destroyCorrection : async function(correc_id){
      try {
        await Correc.destroy({where : {correc_id: correc_id} });
      } catch (e) {
          i.logs("ERROR : function destroyCorrection : " + e);
      }
    },

    getMark : async function(day_id, correctorId) {
        try {
            let correction = await Correc.findOne({
                where : {
                    corrector_id: correctorId,
                    day_id: day_id
                }
            })
            if (correction.outstanding)
                return 45
            else if (correction.validated_correc)
                return 35
            else
                return 0
        } catch (e) {
            i.logs("ERROR : function getMark : " + e);
        }
    },

    getCorrectionsByDayIdCorrectorCorrected : async function(dayId, corrector, corrected) {
        try {
            return await Correc.findOne({
                where : {
                    day_id: dayId,
                    corrected_id : corrected.discord_id,
                    corrector_id : corrector.discord_id,
                }
            })
        } catch (e) {
            i.logs("ERROR : function getCorrectionsByDayIdCorrectorCorrected : " + e);
        }

    },
    getIsFinishedCorrection : async function(Correction) {
        try {
            return await Correc.findOne({
                where : {
                    day_id: dayId,
                    corrected_id : corrected.discord_id,
                    corrector_id : corrector.discord_id,
                }
            })
        } catch (e) {
            i.logs("ERROR : function getCorrectionsByDayIdCorrectorCorrected : " + e);
        }

    },

}