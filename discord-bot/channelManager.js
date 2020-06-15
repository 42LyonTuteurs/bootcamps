const i = require('./index');

async function initCategories(guild) {
    // logs("Categories not found, creating it")
    let parent_category;
    await guild.channels.create("Bootcamp", {
        type: "category",
        position: i.config.CategoryPosition,
    });
    parent_category = guild.channels.cache.find(chan => chan.name === "Bootcamp")
    await guild.channels.create("Inscriptions", {
        type: "text",
        parent: parent_category
    });
    await guild.channels.create("Questions", {
        type: "text",
        parent: parent_category
    });
    await guild.channels.create("logs", {
        type: "text",
        parent: parent_category,
        permissionOverwrites: [
            {
                id: i.config.everyoneRoleId,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: i.botConfig.admin[0],
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: i.botConfig.admin[1],
                allow: ['VIEW_CHANNEL'],
            },
        ],
    });
    // await guild.channels.create("admin-console", {
    //     type: "text",
    //     parent: parent_category,
    //     permissionOverwrites: [
    //         {
    //             id: i.config.everyoneRoleId,
    //             deny: ['VIEW_CHANNEL'],
    //         },
    //         {
    //             id: i.botConfig.admin[0],
    //             allow: ['VIEW_CHANNEL'],
    //         },
    //         {
    //             id: i.botConfig.admin[1],
    //             allow: ['VIEW_CHANNEL'],
    //         },
    //     ],
    // });
    // await guild.channels.create("Tips-d00", {
    //     type: "text",
    //     parent: parent_category
    // });
    // await guild.channels.create("Tips-d01", {
    //     type: "text",
    //     parent: parent_category
    // });
    // await guild.channels.create("Tips-d02", {
    //     type: "text",
    //     parent: parent_category
    // });
    // await guild.channels.create("Tips-d03", {
    //     type: "text",
    //     parent: parent_category
    // });
    // await guild.channels.create("Tips-d04", {
    //     type: "text",
    //     parent: parent_category
    // });
    // await guild.channels.create("Vocal-00", {
    //     type: 'voice',
    //     parent: parent_category
    // });
    // await guild.channels.create("Vocal-01", {
    //     type: "voice",
    //     parent: parent_category
    // });
    // await guild.channels.create("Vocal-02", {
    //     type: "voice",
    //     parent: parent_category
    // });
    // await guild.channels.create("Vocal-03", {
    //     type: "voice",
    //     parent: parent_category
    // });
    // await guild.channels.create("Vocal-04", {
    //     type: "voice",
    //     parent: parent_category
    // });
    // await guild.channels.create("Bootcamp1", {
    //     type: "category",
    //     position: i.config.CategoryPosition,
    // })
    // await guild.channels.create("Bootcamp2", {
    //     type: "category",
    //     position: i.config.CategoryPosition,
    // })
    // await guild.channels.create("Bootcamp3", {
    //     type: "category",
    //     position: i.config.CategoryPosition,
    // })
    // await guild.channels.create("Bootcamp4", {
    //     type: "category",
    //     position: i.config.CategoryPosition,
    // })
}

module.exports.initCategories = initCategories