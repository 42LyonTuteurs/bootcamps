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
        subject: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        correction: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        who_correction: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        corrected: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        who_corrected:{
            type: DataTypes.STRING,
            defaultValue: null,
        },
        day_complete: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        timestamps: false,
    });
};