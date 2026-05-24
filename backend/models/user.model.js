const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {

    const User = sequelize.define(
        "User",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "follower",
                validate: {
                    isIn: [["creator", "follower"]]
                }
            },
            profile_picture: {
                type: DataTypes.STRING,
                allowNull: true
            },
            banner: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            tableName: "users"
        }
    );
    return User;
}
