const { Users, Stat, Day } = require('../dbObject');
const dayCtrl = require('./DayCtrl');
const statCtrl =  require('./StatCtrl');

module.exports = {

    addUser: async function (discord_id, login) {
        const newUser = await Users.create({discord_id: discord_id, login: login});
        await statCtrl.createStatByDiscordId(discord_id);
    },

    printAllLogin : async function(){
        const List = await Users.findAll({attributes: ['login']});
        const ListString = List.map(t => t.login).join(' : ') || 'No tags set.';
        console.log(ListString);
    },

    printUserInfoByLogin: async function (login) {
        const user = await Users.findOne({where: {login: login}});
        console.log("discord id     : " + user.discord_id);
        console.log("login          : " + user.login);
        await statCtrl.printStatByDiscordId(user.discord_id);
    },

    printUserInfoByUser: async function (user) {
         await this.printUserInfoByLogin(user.login);
    },

    getUserByLogin : async function(login){
        const user = await Users.findOne({where: {login: login}});
        return (user);
    },

    getUserByDiscordId : async function(discord_id){
        const user = await Users.findOne({where: {discord_id: discord_id}});
        return (user);
    },

    deleteUserByUser : async function(user){
        await user.destroy();
    },

    deleteUserByDiscordId : async function(discord_id){
        await Users.destroy({ where: { discord_id: discord_id } });
    },

    deleteUserByLogin : async function(login){
        await Users.destroy({ where: { login: login } });
    },

    
}