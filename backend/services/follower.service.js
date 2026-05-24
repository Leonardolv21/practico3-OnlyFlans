const db = require("../models");
const userService = require("./user.service");

const addInteraction = async (followerId, creatorId, type) => {
    const creator = await userService.findCreatorById(creatorId);
    if (!creator) {
        return { error: "CREATOR_NOT_FOUND" };
    }

    const [item] = await db.creatorInteraction.findOrCreate({
        where: { follower_id: followerId, creator_id: creatorId, type }
    });
    return item;
};

const removeInteraction = async (followerId, creatorId, type) => {
    await db.creatorInteraction.destroy({ where: { follower_id: followerId, creator_id: creatorId, type } });
};

const followerService = {
    addFavorite: async (followerId, creatorId) => addInteraction(followerId, creatorId, "favorite"),
    removeFavorite: async (followerId, creatorId) => removeInteraction(followerId, creatorId, "favorite"),
    getFavorites: async (followerId) => {
        return await db.creatorInteraction.findAll({
            where: { follower_id: followerId, type: "favorite" },
            include: [{ model: db.user, as: "creator", attributes: ["id", "name", "profile_picture", "banner"] }]
        });
    },
    followCreator: async (followerId, creatorId) => addInteraction(followerId, creatorId, "following"),
    unfollowCreator: async (followerId, creatorId) => removeInteraction(followerId, creatorId, "following"),
    getFeed: async (followerId) => {
        const follows = await db.creatorInteraction.findAll({ where: { follower_id: followerId, type: "following" } });
        const creatorIds = follows.map((f) => f.creator_id);
        if (!creatorIds.length) {
            return [];
        }

        return await db.post.findAll({
            where: { creator_id: creatorIds },
            include: [{ model: db.user, as: "creator", attributes: ["id", "name", "profile_picture"] }],
            order: [["published_at", "DESC"]]
        });
    }
};

module.exports = followerService;
