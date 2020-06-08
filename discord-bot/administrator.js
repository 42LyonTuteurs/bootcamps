const utils = require('./utils.js');
const usrCmd = require('./userCommands')
const i = require('./index');
const { Users, Stat, Day } = require('./dbObject');

module.exports = {
    forceCorrectionDone:  async function (login, nbDay) {
        const day = await utils.getDayByDayId(await utils.getDayIdByUser(await utils.getUserByLogin(login), nbDay));
        try {
            await Day.update({correction: 2}, {where: {day_id: day.day_id}});
        } catch (e) {
            i.logs("ERROR : function forceCorrectionDone : " + e);
        }
    },

    forceCorrectedDone:  async function (login, nbDay) {
        const day = await utils.getDayByDayId(await utils.getDayIdByUser(await utils.getUserByLogin(login), nbDay));
        try {
            await Day.update({corrected: 2}, {where: {day_id: day.day_id}});
        } catch (e) {
            i.logs("ERROR : function forceCorrectedDone : " + e);
        }
    },

    forceDayValidated : async function (login, nbDay) {
        const day = await utils.getDayByDayId(await utils.getDayIdByUser(await utils.getUserByLogin(login), nbDay));
        try {
            await Day.update({day_validated: 1}, {where: {day_id: day.day_id}});
        } catch (e) {
            i.logs("ERROR : function forceCorrectedDone : " + e);
        }
    },

    forceDayComplete :async function (login, nbDay) {
        const day = await utils.getDayByDayId(await utils.getDayIdByUser(await utils.getUserByLogin(login), nbDay));
        try {
            await Day.update({day_complete: 1}, {where: {day_id: day.day_id}});
        } catch (e) {
            i.logs("ERROR : function forceCorrectedDone : " + e);
        }
    },

    forceSetStatCorrection: async function (login) {
        console.log("login ==>" + login);
        const stat = await utils.getStatByLogin(login);
        try {
            await Stat.update({correction: stat.correction + 1}, {where: {user_id: stat.user_id}});
        } catch (e) {
            i.logs("ERROR : function forceSetStatCorrection : " + e);
        }
    },

    forceSetStatCorrected: async function (login) {
        const stat = await utils.getStatByLogin(login);
        try {
            await Stat.update({corrected: stat.corrected + 1}, {where: {user_id: stat.user_id}});
        } catch (e) {
            i.logs("ERROR : function forceSetStatCorrection : " + e);
        }
    },

    forceSetStatDaysDone: async function (login) {
        const stat = await utils.getStatByLogin(login);
        try {
            await Stat.update({days_done: stat.days_done + 1}, {where: {user_id: stat.user_id}});
        } catch (e) {
            i.logs("ERROR : function forceSetStatCorrection : " + e);
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

    adminHelp: async function(message){
        let str = "__**HELP ADMIN MENU**__\n\n"+
            "You will find all the commands you can use in this discord just behind :\n\n" +
            "**" + i.PREFIX + "admin dayCorrection <login> <day>**\n> set day correction = 2 \n\n" +
            "**" + i.PREFIX + "admin dayCorrected <login> <day>**\n> set day corrected = 2 \n\n" +
            "**" + i.PREFIX + "admin dayValidated <login> <day>**\n> set day validated = 2 \n\n" +
            "**" + i.PREFIX + "admin dayComplete <login> <day>**\n> set day complete = 2 \n\n" +
            "**" + i.PREFIX + "admin statCorrection <login>**\n> set stat correction = +1 \n\n" +
            "**" + i.PREFIX + "admin statCorrected <login>**\n> set stat corrected = +1\n\n" +
            "**" + i.PREFIX + "admin statDaysDone <login>**\n> set stat days done = +1 \n\n" +
            "**" + i.PREFIX + "admin resetAllDays confirm **\n> set all days null for all users\n\n" +
            "**" + i.PREFIX + "admin resetSpecificDays confirm <day>**\n> set <day> null for all users \n\n"+
            "**" + i.PREFIX + "admin destroyChans confirm **\n> destroy all channels \n\n"+
            "**" + i.PREFIX + "admin recoverChans confirm **\n> create channels for all users subscribed \n\n";
        message.channel.send(str);
    },

    createNewChanMass: async function(message, discord_id)
    {
        if (utils.isAdmin(discord_id))
        {
            const everyoneRole = message.guild.roles.cache.get(config.everyoneRoleId);
            for (let count = 1; count < 50; count++)
            {
                var nbCur = 0;
                message.guild.channels.cache.forEach(element => {
                    if (element.name.startsWith("bootcamp-") == true)
                        nbCur++;
                })
                i.logs(nbCur);
                message.guild.channels.create("bootcamp " + "test-" + count, {
                    type: "text",
                    parent: categories[Math.round(nbCur / 50)],
                    permissionOverwrites: [
                        {
                            id: everyoneRole,
                            deny: ['VIEW_CHANNEL'],
                        },
                        {
                            id: message.author.id,
                            allow: ['VIEW_CHANNEL'],
                        },
                    ],});
            }
        }
        else
            help(message);
    },

    recoverPrivateChan: async function(message, discord_id)
    {
        if (utils.isAdmin(discord_id))
        {
            destroyPrivateChan(message, discord_id);
            let nbCur = 0;
            let data = await utils.All();
            data.forEach(t => {
                if (t.actif)
                {
                    const everyoneRole = message.guild.roles.cache.get(config.everyoneRoleId);
                    const PrivateChannelWithBot = "bootcamp " + t.login;
                    message.guild.channels.create(PrivateChannelWithBot, {
                        type: "text",
                        parent: categories[Math.round(nbCur / 50)],
                        permissionOverwrites: [
                            {
                                id: everyoneRole,
                                deny: ['VIEW_CHANNEL'],
                            },
                            {
                                id: t.discord_id,
                                allow: ['VIEW_CHANNEL'],
                            },
                        ],})
                        .then(r => {
                            r.send("<@" + t.discord_id + ">\n> **Here is your private channel with the bot, please enter here your commands to interract with the bot**" +
                                "\n\n__**HELP MENU**__\n\n"+
                                "You will find all the commands you can use in this discord just behind :\n\n" +
                                "**" + PREFIX + "subscribe**\n> to subscribe to the bootcamp, a private channel will be created\n\n" +
                                "**" + PREFIX + "info**\n> to diplay info from yourself or from other participant with *" + PREFIX + "info <login>*\n\n" +
                                "**" + PREFIX + "validates <login> <day> <validated/notvalidated>**\n> to tell the bot that you corrected the <day> of <login> and if the day is <validated> or <notvalidated>\n\n" +
                                "**" + PREFIX + "corrected by <login> <day>**\n> to tell the bot that your <day> have been corrected by <login>\n\n" +
                                "**" + PREFIX + "unsubscribe**\n> __**THIS COMMAND IS A DEFINITIVE UNSUBSCRIPTION FROM THE BOOTCAMP**__\n\n" +
                                "\n__**" + PREFIX + "help**__ to to diplay all the commands you can use !"
                            );
                        })
                        .catch(console.error);
                    nbCur++;
                }
            });
        }
        else
            help(message);
    },

    destroyPrivateChan: async function(message, discord_id)
    {
        if (utils.isAdmin(discord_id))
        {
            let count = 0;
            message.guild.channels.cache.forEach(element => {
                if (element.name.startsWith("bootcamp-") == true)
                {
                    element.delete();
                    count++;
                }
            });
            message.channel.send("Remove " + count + " channels.");
        }
        else
            help(message);
    },

    adminCommands : async function(message, argv, name, discord_id){
        if (utils.isAdmin(discord_id))
        {
            const login = argv[1];
            const nbDay = argv[2];
            if (login === undefined){
                await this.adminHelp(message);
                return (0);
            }
            if (argv[0] === 'dayCorrection'){
                if (nbDay === undefined)
                    await this.adminHelp(message);
                await this.forceCorrectionDone(login, nbDay);
            }
            else if (argv[0] === 'dayCorrected'){
                if (nbDay === undefined)
                    await this.adminHelp(message);
                await this.forceCorrectedDone(login, nbDay);
            }
            else if (argv[0] === 'dayValidated'){
                if (nbDay === undefined)
                    await this.adminHelp(message);
                await this.forceDayValidated(login, nbDay);
            }
            else if (argv[0] === 'dayComplete'){
                if (nbDay === undefined)
                    await this.adminHelp(message);
                await this.forceDayComplete(login, nbDay);
            }
            else if (argv[0] === 'statCorrection'){
                await this.forceSetStatCorrection(login);
            }
            else if (argv[0] === 'statCorrected'){
                await this.forceSetStatCorrected(login);
            }
            else if (argv[0] === 'statDaysDone'){
                await this.forceSetStatDaysDone(login);
            }
            else if (argv[0] === 'resetAllDays' && login === "confirm"){
                await this.forceSetAllDaysNull();
            }
            else if (argv[0] === 'resetSpecificDays' && login === "confirm"){
                await this.forceSetSpecificDayNull(nbDay);
            }
            else if (argv[0] === 'destroyChans' && login === "confirm"){
                await this.destroyPrivateChan(message, discord_id);
            }
            else if (argv[0] === 'recoverChans' && login === "confirm"){
                await this.recoverPrivateChan(message, discord_id);
            }
            else if (argv[0] === 'allWithMana'&& login === "confirm"){
                await utils.allwithMana(message);
            }
            else
                await this.adminHelp(message);
        }
        else
            usrCmd.help(message);
    }
}