const {Users} = require('../dbObject');
const i = require('../index');

module.exports = {

    createUser: async function (discord_id, login) {
        try {
            await Users.create({discord_id: discord_id, login: login});
        } catch (e) {
            i.logs("ERROR : function createUser : " + e);
        }
    },

    getAllUser: async function (){
        try {
            const List = await Users.findAll();
            return List;
        } catch (e) {
            i.logs("ERROR : function getAllUser : " + e);
        }
    },

    getUserByLogin : async function(login) {
        try {
            const user = await Users.findOne({where: {login: login}});
            return (user);
        } catch (e) {
            i.logs("ERROR : function getUserByLogin : " + e);
        }
    },

    getUserByDiscordId : async function(discord_id) {
        try {
            const user = await Users.findOne({where: {discord_id: discord_id}});
            return (user);
        } catch (e) {
            i.logs("ERROR : function getUserByDiscordId : " + e);
        }
    },

    updateUserActivity : async function(user, val){
        try {
            await Users.update({ actif: val }, { where: { discord_id: user.discord_id } });
        } catch (e) {
            i.logs("ERROR : function updateUserActivity : " + e);
        }
    },
    
}