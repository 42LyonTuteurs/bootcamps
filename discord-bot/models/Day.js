module.exports = (sequelize, DataTypes) => {
    return sequelize.define('day', {
        day_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        day_nb: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        day_set:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        corrected: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        day_done: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        outstanding_day: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        timestamps: false,
    });
};