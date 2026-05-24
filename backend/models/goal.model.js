const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Goal = sequelize.define(
        "Goal",
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            creator_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: "goals"
        }
    );

    return Goal;
};
