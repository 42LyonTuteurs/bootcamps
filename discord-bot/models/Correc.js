module.exports = (sequelize, DataTypes) => {
    return sequelize.define('correc', {
        correc_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        day_id: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        corrector_id: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        corrected_id: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        corrector_validation: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        corrected_validation: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        validated_correc: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        outstanding: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        timestamps: true,
    });
};


