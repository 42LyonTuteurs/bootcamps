const configFile = require ('./config.json');
const botConfig = configFile.botConfig;
const PREFIX = botConfig.prefix

help = "**Here is your private channel with the bot, please enter here your commands to interact with the bot**" +
    "\n\n__**HELP MENU**__\n\n" +
    "You will find all the commands you can use in this discord just behind :\n\n" +
    "**" + PREFIX + "subscribe**\n> to subscribe to the bootcamp, a private channel will be created\n\n" +
    "**" + PREFIX + "info**\n> to diplay info from yourself or from other participant with *:info <login>*\n\n" +
    "**" + PREFIX + "validates <login> <day> <validated/notvalidated>**\n> to tell the bot that you corrected the <day> of <login> and if the day is <validated> or <notvalidated>\n\n" +
    "**" + PREFIX + "corrected by <login> <day>**\n> to tell the bot that your <day> have been corrected by <login>\n\n" +
    "**" + PREFIX + "get corrections**\n> this will resend your pending corrections\n\n" +
    "**" + PREFIX + "unsubscribe**\n> __**THIS COMMAND IS A DEFINITIVE UNSUBSCRIPTION FROM THE BOOTCAMP**__\n\n" +
    "\n__**" + PREFIX + "help**__ to to display all the commands you can use !"

module.exports.help = help