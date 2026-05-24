const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Comment = sequelize.define(
        "Comment",
        {
            text: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            post_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            follower_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            creator_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: "comments"
        }
    );

    return Comment;
};
