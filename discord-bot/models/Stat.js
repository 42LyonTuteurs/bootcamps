

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('stat', {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        days_done: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        correction: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        corrected: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        day0_id: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        day1_id: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        day2_id: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        day3_id: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        day4_id: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
    }, {
        timestamps: false,
    });
};


