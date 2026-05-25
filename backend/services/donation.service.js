const { Op } = require("sequelize");
const db = require("../models");
const userService = require("./user.service");

const donationService = {
    createDonation: async (followerId, { creator_id, flan_count, support_type }) => {
        const creator = await userService.findCreatorById(creator_id);
        if (!creator) {
            return { error: "CREATOR_NOT_FOUND" };
        }

        const donation = await db.donation.create({
            follower_id: followerId,
            creator_id,
            flan_count,
            support_type: support_type || "flan"
        });

        await db.creatorInteraction.findOrCreate({
            where: {
                follower_id: followerId,
                creator_id,
                type: "following"
            }
        });

        return donation;
    },
    getMyDonationHistory: async (followerId, filters) => {
        const where = { follower_id: followerId };
        if (filters.startDate || filters.endDate) {
            where.donated_at = {};
            if (filters.startDate) where.donated_at[Op.gte] = new Date(filters.startDate);
            if (filters.endDate) where.donated_at[Op.lte] = new Date(filters.endDate);
        }

        const creatorWhere = { role: "creator" };
        if (filters.creatorName) {
            creatorWhere.name = { [Op.like]: `%${filters.creatorName}%` };
        }

        return await db.donation.findAll({
            where,
            include: [{ model: db.user, as: "creator", where: creatorWhere, attributes: ["id", "name"] }],
            order: [["donated_at", "DESC"]]
        });
    }
};

module.exports = donationService;
