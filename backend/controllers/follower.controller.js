const followerService = require("../services/follower.service");

exports.addFavorite = async (req, res) => {
    const result = await followerService.addFavorite(req.user.id, req.params.creatorId);
    if (result.error === "CREATOR_NOT_FOUND") {
        return res.status(404).json({ message: "Creator not found" });
    }

    res.status(201).json(result);
};

exports.removeFavorite = async (req, res) => {
    await followerService.removeFavorite(req.user.id, req.params.creatorId);
    res.status(204).send();
};

exports.getFavorites = async (req, res) => {
    const favorites = await followerService.getFavorites(req.user.id);
    res.status(200).json(favorites);
};

exports.followCreator = async (req, res) => {
    const result = await followerService.followCreator(req.user.id, req.params.creatorId);
    if (result.error === "CREATOR_NOT_FOUND") {
        return res.status(404).json({ message: "Creator not found" });
    }

    res.status(201).json(result);
};

exports.unfollowCreator = async (req, res) => {
    await followerService.unfollowCreator(req.user.id, req.params.creatorId);
    res.status(204).send();
};

exports.getFeed = async (req, res) => {
    const feed = await followerService.getFeed(req.user.id);
    res.status(200).json(feed);
};
