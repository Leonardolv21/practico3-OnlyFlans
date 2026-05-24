const creatorService = require("../services/creator.service");

exports.putMyProfile = async (req, res) => {
    const creator = await creatorService.updateMyProfile(req.user.id, req.body, req.files);
    res.status(200).json(creator);
};

exports.getCreatorSearch = async (req, res) => {
    const creators = await creatorService.searchCreators(req.query.q || "");
    res.status(200).json(creators);
};

exports.getCreatorProfile = async (req, res) => {
    const viewerId = req.user ? req.user.id : null;
    const data = await creatorService.getCreatorProfile(req.params.id, viewerId);
    if (!data) {
        return res.status(404).json({ message: "Creator not found" });
    }
    res.status(200).json(data);
};

exports.getMyDashboard = async (req, res) => {
    const dashboard = await creatorService.getCreatorDashboard(req.user.id);
    res.status(200).json(dashboard);
};

exports.getMyIncomeReport = async (req, res) => {
    const result = await creatorService.getIncomeReport(req.user.id, req.query.startDate, req.query.endDate);
    res.status(200).json(result);
};

exports.postMyGoal = async (req, res) => {
    const goal = await creatorService.createGoal(req.user.id, req.body);
    res.status(201).json(goal);
};

exports.getMyGoals = async (req, res) => {
    const goals = await creatorService.getMyGoals(req.user.id);
    res.status(200).json(goals);
};

exports.patchMyGoal = async (req, res) => {
    const goal = await creatorService.updateGoal(req.user.id, req.params.goalId, req.body);
    if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json(goal);
};

exports.deleteMyGoal = async (req, res) => {
    const deleted = await creatorService.deleteGoal(req.user.id, req.params.goalId);
    if (!deleted) {
        return res.status(404).json({ message: "Goal not found" });
    }

    res.status(204).send();
};

exports.getCreatorPosts = async (req, res) => {
    const result = await creatorService.getCreatorPostsForViewer(req.params.id, req.user.id);
    if (result.error === "CREATOR_NOT_FOUND") {
        return res.status(404).json({ message: "Creator not found" });
    }
    if (result.error === "DONATION_REQUIRED") {
        return res.status(403).json({ message: "You must donate before viewing posts" });
    }

    res.status(200).json(result.posts);
};
