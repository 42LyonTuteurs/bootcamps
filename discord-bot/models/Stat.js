
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
        days_outstanding: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        correction: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        pending_correc: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        strike: {
            type: DataTypes.INTEGER,
            defaultValue: 3,
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
        mana: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        mana_june: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        timestamps: false,
    });
};


