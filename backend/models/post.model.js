const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Post = sequelize.define(
        "Post",
        {
            text: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            image_url: {
                type: DataTypes.STRING,
                allowNull: true
            },
            published_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            creator_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: "posts"
        }
    );

    return Post;
};
