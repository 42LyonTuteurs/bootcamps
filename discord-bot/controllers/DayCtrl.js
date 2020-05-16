const { Users, Stat, Day } = require('../dbObject');
const userCtrl = require('./UsersCtrl');
const statCtrl =  require('./StatCtrl');


module.exports = {
    // createDay: async function (User, nbDay) {
    //     const stat = await Stat.findOne({where: {user_id: User.discord_id}});
    //
    //     await this.printDayByStat(stat, 0);
    //
    //     const newDay = await Day.create({day_nb: nbDay});
    //     if (nbDay == 0){
    //         stat.day0_id = newDay.id;
    //     } else if (nbDay == 1){
    //         stat.day1_id = newDay.id
    //     } else if (nbDay == 2){
    //         stat.day2_id = newDay.id
    //     } else if (nbDay == 3){
    //         stat.day3_id = newDay.id
    //     } else if (nbDay == 4){
    //         stat.day4_id = newDay.id
    //     } else
    //         return (1);
    //     await this.printDayByStat(stat, 0);
    //     return (0);
    // },
    //
    // printDayByStat : async function(stat, nbDay){
    //     let day = 0;
    //     if (nbDay == 0){
    //         day = stat.day0_id;
    //     } else if (nbDay == 1){
    //         day = stat.day1_id;
    //     } else if (nbDay == 2){
    //         day = stat.day2_id;
    //     } else if (nbDay == 3){
    //         day = stat.day3_id;
    //     } else if (nbDay == 4){
    //         day = stat.day4_id;
    //     } else
    //         return (1);
    //     await this.printDay(day);
    //     // const ListString = List.map(t => t.login).join(' : ') || 'No tags set.';
    //     // console.log(List);
    // },
    //
    // printDay : async function(day){
    //     if (day == null){
    //         console.log("day is null");
    //         return (1);
    //     }
    //     console.log("day id         : " + day.day_id);
    //     console.log("day nb         : " + day.day_nb);
    //     console.log("subject        : " + day.subject);
    //     console.log("correction     : " + day.correction);
    //     console.log("correction on  : " + day.who_correction);
    //     console.log("corrected      : " + day.corrected);
    //     console.log("corrected by   : " + day.who_corrected);
    //     console.log("day complete   : " + day.day_complete);
    // },


}