module.exports = (sequelize, DataTypes) => {
    return sequelize.define('correc', {
        correc_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        day_id: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        corrector_id: {
            type: DataTypes.STRING,
            defaultValue: 0,
        },
        corrected_id: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        corrector_validation: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        corrected_validation: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        outstanding: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
    }, {
        timestamps: false,
    });
};


