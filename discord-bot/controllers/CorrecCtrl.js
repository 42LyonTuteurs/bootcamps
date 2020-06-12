const {Correc} = require('../dbObject');
const i = require('../index');

module.exports = {
    createCorrection : async function(day_id, corrector_id, corrected_id) {
        try {
            await Correc.create({ day_id: day_id, corrector_id: corrector_id, corrected_id: corrected_id});
        } catch (e) {
            i.logs("ERROR : function createCorrection : " + e);
        }
    },

    getCorrectionsNotDoneByCorrector : async function(corrector, corrected){
        try{
            return await Correc.findAll({where : {corrector_validation: 0, corrector_id: corrector.discord_id, corrected_id: corrected.discord_id}})
        } catch (e) {
            i.logs("ERROR : function getCorrectionsNotDoneByCorrector : " + e);
        }
    },

    getCorrectionsByUsers : async function(corrector, corrected) {
        try {
            return await Correc.findAll({where : {corrector_id: corrector.discord_id, corrected_id: corrected.discord_id, corrector_validation: 0,}});
        } catch (e) {
            i.logs("ERROR : function getCorrectionsByUsers : " + e);
        }
    },

    getAllCorrection : async function(){
        try {
            return await Correc.findAll();

        } catch (e) {
            i.logs("ERROR : function getCorrectionsByUsers : " + e);
        }
    },

    //no necessary
    getCorrectionByCorrecId : async function(correc_id) {
        try {
            return await Correc.findOne({where : {correc_id: correc_id}});
        } catch (e) {
            i.logs("ERROR : function getCorrectionByCorrecId : " + e);
        }
    },


    updateCorrectorValidation : async function(day_id, val) {
        try {
            await Correc.update({ corrector_validation: val}, {where : {day_id : day_id}});
        } catch (e) {
            i.logs("ERROR : function updateCorrectorValidation : " + e);
        }
    },

    updateCorrectedValidation : async function(day_id, val) {
        try {
            await Correc.update({ corrected_validation: val}, {where : {day_id : day_id}});
        } catch (e) {
            i.logs("ERROR : function updateCorrectedValidation : " + e);
        }
    },

    updateValidatedCorrection : async function(day_id, val) {
        try {
            await Correc.update({ validated_correc: val}, {where : {day_id : day_id}});
        } catch (e) {
            i.logs("ERROR : function updateValidatedCorrection : " + e);
        }
    },

    updateOutstanding : async function(day_id, val) {
        try {
            await Correc.update({ outstanding: val}, {where : {day_id : day_id}});
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
}