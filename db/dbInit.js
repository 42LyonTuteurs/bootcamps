const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});


const Users = sequelize.import('models/Users');
const Day = sequelize.import('models/Day');
const Stat =  sequelize.import('models/Stat');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
    const list = [
        Users.upsert({discord_id: 'sdfsgdvs',login: 'jdarko'}),
        Users.upsert({discord_id: 'sdgfgsrd',login: 'rcepre'}),
        Users.upsert({discord_id: 'sdfsdvsd',login: 'tclaudel'}),
    ];
    await Promise.all(list);
    console.log('Database synced');
    sequelize.close();
}).catch(console.error);
