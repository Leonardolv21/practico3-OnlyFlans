const { Op } = require("sequelize");
const db = require("../models");

const getUploadedFilePath = (file, folderName) => {
    if (!file) {
        return null;
    }

    return `/uploads/${folderName}/${file.filename}`;
};

const canViewPosts = async (viewerId, creatorId) => {
    if (viewerId === creatorId) {
        return true;
    }

    const donation = await db.donation.findOne({ where: { follower_id: viewerId, creator_id: creatorId } });
    return Boolean(donation);
};

const creatorService = {
    updateMyProfile: async (creatorId, payload, files) => {
        const creator = await db.user.findByPk(creatorId);

        const profilePictureFile = files && files.profile_picture ? files.profile_picture[0] : null;
        const bannerFile = files && files.banner ? files.banner[0] : null;

        if (profilePictureFile) {
            creator.profile_picture = getUploadedFilePath(profilePictureFile, "profile_pictures");
        } else if (payload.profile_picture !== undefined) {
            creator.profile_picture = payload.profile_picture || null;
        }

        if (bannerFile) {
            creator.banner = getUploadedFilePath(bannerFile, "banners");
        } else if (payload.banner !== undefined) {
            creator.banner = payload.banner || null;
        }

        await creator.save();
        return creator;
    },
    createGoal: async (creatorId, payload) => {
        return await db.goal.create({
            title: payload.title,
            description: payload.description,
            is_active: payload.is_active ?? true,
            creator_id: creatorId
        });
    },
    getMyGoals: async (creatorId) => {
        return await db.goal.findAll({
            where: { creator_id: creatorId },
            order: [["createdAt", "DESC"]]
        });
    },
    updateGoal: async (creatorId, goalId, payload) => {
        const goal = await db.goal.findOne({ where: { id: goalId, creator_id: creatorId } });
        if (!goal) {
            return null;
        }

        if (payload.title !== undefined) goal.title = payload.title;
        if (payload.description !== undefined) goal.description = payload.description;
        if (payload.is_active !== undefined) goal.is_active = payload.is_active;
        await goal.save();
        return goal;
    },
    deleteGoal: async (creatorId, goalId) => {
        const deleted = await db.goal.destroy({ where: { id: goalId, creator_id: creatorId } });
        return deleted > 0;
    },
    searchCreators: async (query) => {
        return await db.user.findAll({
            where: {
                role: "creator",
                name: {
                    [Op.like]: `%${query || ""}%`
                }
            },
            attributes: ["id", "name", "profile_picture", "banner"]
        });
    },
    getCreatorProfile: async (creatorId, viewerId) => {
        const creator = await db.user.findOne({
            where: { id: creatorId, role: "creator" },
            attributes: ["id", "name", "profile_picture", "banner"]
        });
        if (!creator) {
            return null;
        }

        const activeGoals = await db.goal.findAll({
            where: { creator_id: creatorId, is_active: true },
            order: [["createdAt", "DESC"]]
        });

        const hasAccessToPosts = await canViewPosts(viewerId, creatorId);
        return {
            creator,
            active_goals: activeGoals,
            can_view_posts: hasAccessToPosts
        };
    },
    getCreatorPostsForViewer: async (creatorId, viewerId) => {
        const creator = await db.user.findOne({ where: { id: creatorId, role: "creator" } });
        if (!creator) {
            return { error: "CREATOR_NOT_FOUND" };
        }

        const canView = await canViewPosts(viewerId, creatorId);
        if (!canView) {
            return { error: "DONATION_REQUIRED" };
        }

        const posts = await db.post.findAll({
            where: { creator_id: creatorId },
            include: [{ model: db.user, as: "creator", attributes: ["id", "name", "profile_picture"] }],
            order: [["published_at", "DESC"]]
        });

        return { posts };
    },
    getCreatorDashboard: async (creatorId) => {
        return await db.post.findAll({
            where: { creator_id: creatorId },
            include: [{
                model: db.comment,
                as: "comments",
                include: [{ model: db.user, as: "follower", attributes: ["id", "name"] }],
                order: [["created_at", "DESC"]]
            }],
            order: [["published_at", "DESC"]]
        });
    },
    getIncomeReport: async (creatorId, startDate, endDate) => {
        const where = { creator_id: creatorId };
        if (startDate || endDate) {
            where.donated_at = {};
            if (startDate) where.donated_at[Op.gte] = new Date(startDate);
            if (endDate) where.donated_at[Op.lte] = new Date(endDate);
        }

        const history = await db.donation.findAll({
            where,
            include: [{ model: db.user, as: "follower", attributes: ["id", "name", "email"] }],
            order: [["donated_at", "DESC"]]
        });

        const total_flans = history.reduce((sum, item) => sum + item.flan_count, 0);
        return { history, total_flans };
    },
    canViewPosts
};

module.exports = creatorService;
