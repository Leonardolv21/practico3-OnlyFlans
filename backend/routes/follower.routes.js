const { Router } = require("express");
const requireAuth = require("../middlewares/user.middleware");
const requireRole = require("../middlewares/role.middleware");
const controller = require("../controllers/follower.controller");

module.exports = (app) => {
    const router = Router();

    router.post("/favorites/:creatorId", requireAuth, requireRole("follower"), controller.addFavorite);
    router.delete("/favorites/:creatorId", requireAuth, requireRole("follower"), controller.removeFavorite);
    router.get("/favorites", requireAuth, requireRole("follower"), controller.getFavorites);
    router.post("/following/:creatorId", requireAuth, requireRole("follower"), controller.followCreator);
    router.delete("/following/:creatorId", requireAuth, requireRole("follower"), controller.unfollowCreator);
    router.get("/feed", requireAuth, requireRole("follower"), controller.getFeed);

    app.use("/followers", router);
};
