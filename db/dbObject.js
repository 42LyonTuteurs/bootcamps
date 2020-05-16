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

// Users.belongsTo(Stat, { foreignKey: 'id', as: 'user' });
//
// Users.prototype.getLogin = function(){
//   const User = Users.findOne({
//       where : {user_id:this.user_id},
//   })
//     console.log(User.login);
//     return (User)
// };

// function printLogin(User){
//
// }
//

// Users.prototype.addItem = async function(item) {
//     const userItem = await UserItems.findOne({
//         where: { user_id: this.user_id, item_id: item.id },
//     });
//
//     if (userItem) {
//         userItem.amount += 1;
//         return userItem.save();
//     }
//
//     return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1 });
// };
//
// Users.prototype.getItems = function() {
//     return UserItems.findAll({
//         where: { user_id: this.user_id },
//         include: ['item'],
//     });
// };
//

module.exports = { Users, Day, Stat };
