const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const CreatorInteraction = sequelize.define(
        "CreatorInteraction",
        {
            follower_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                unique: false
            },
            creator_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                unique: false
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
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
