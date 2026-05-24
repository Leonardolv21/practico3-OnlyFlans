const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Donation = sequelize.define(
        "Donation",
        {
            flan_count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                validate: {
                    min: 1
                }
            },
            support_type: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "flan"
            },
            donated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
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
            tableName: "donations"
        }
    );

    return Donation;
};
