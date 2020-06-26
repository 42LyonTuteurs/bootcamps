const configFile = require ('./config.json');
const botConfig = configFile.botConfig;
const PREFIX = botConfig.prefix

help = "**Here is your private channel with the bot, please enter here your commands to interact with the bot**" +
    "\n\n__**HELP MENU**__\n\n" +
    "You will find all the commands you can use in this discord below :\n\n" +
    "**" + PREFIX + "subscribe**\n> Subscription to the bootcamp. A private channel will be created\n\n" +
    "**" + PREFIX + "info**\n> Display info about yourself or about another participant with *;info <login>*\n\n" +
    "**" + PREFIX + "get corrections**\n> Display your pending corrections\n\n" +
    "**" + PREFIX + "day done**\n> Set your current day as finished\n\n" +
    "**" + PREFIX + "missing <corrector/corrected> <login>**\n> Set your corrector as missing. This will set another correction\n\n" +
    "**" + PREFIX + "corrected <login> <notValidated/done/outstanding>**\n> Set the correction as finished with a grade\n\n" +
    "**" + PREFIX + "feedback <login> **\n> Feedback your corrector\n\n" +
    "**" + PREFIX + "unsubscribe**\n> __**THIS COMMAND IS A DEFINITIVE UNSUBSCRIPTION FROM THE BOOTCAMP**__\n\n" +
    "\n__**" + PREFIX + "help**__ to to display all the commands you can use !"

module.exports.help = help