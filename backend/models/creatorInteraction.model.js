const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const CreatorInteraction = sequelize.define(
        "CreatorInteraction",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            follower_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: false
            },
            creator_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: false
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [["favorite", "following"]]
                }
            }
        },
        {
            tableName: "creator_interactions",
            indexes: [
                {
                    unique: true,
                    fields: ["follower_id", "creator_id", "type"]
                }
            ]
        }
    );

    return CreatorInteraction;
};
