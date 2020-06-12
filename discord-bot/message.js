const i = require('./index');

function help() {
    let helpMsg = "**Here is your private channel with the bot, please enter here your commands to interract with the bot**" +
        "\n\n__**HELP MENU**__\n\n" +
        "You will find all the commands you can use in this discord just behind :\n\n" +
        "**" + i.PREFIX + "subscribe**\n> to subscribe to the bootcamp, a private channel will be created\n\n" +
        "**" + i.PREFIX + "info**\n> to diplay info from yourself or from other participant with *:info <login>*\n\n" +
        "**" + i.PREFIX + "validates <login> <day> <validated/notvalidated>**\n> to tell the bot that you corrected the <day> of <login> and if the day is <validated> or <notvalidated>\n\n" +
        "**" + i.PREFIX + "corrected by <login> <day>**\n> to tell the bot that your <day> have been corrected by <login>\n\n" +
        "**" + i.PREFIX + "unsubscribe**\n> __**THIS COMMAND IS A DEFINITIVE UNSUBSCRIPTION FROM THE BOOTCAMP**__\n\n" +
        "\n__**" + i.PREFIX + "help**__ to to diplay all the commands you can use !"
    return helpMsg
}

module.exports.help = help