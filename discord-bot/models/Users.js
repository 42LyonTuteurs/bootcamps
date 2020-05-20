module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users_list', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        discord_id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        login: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        actif: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
    }, {
        timestamps: false,
    });
};