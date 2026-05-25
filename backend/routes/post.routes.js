const { Router } = require("express");
const requireAuth = require("../middlewares/user.middleware");
const requireRole = require("../middlewares/role.middleware");
const schemaValidation = require("../middlewares/schemaValidation.middleware");
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware");
const { uploadPostImage } = require("../middlewares/upload.middleware");
const controller = require("../controllers/post.controller");
const { createCommentSchema } = require("../validators/post.schema");

module.exports = (app) => {
    const router = Router();

    router.post("/", requireAuth, requireRole("creator"), uploadPostImage, controller.createPost);
    router.post("/:id/comments", requireAuth, requireRole("follower"), isJsonRequestValid, schemaValidation(createCommentSchema), controller.createComment);

    app.use("/posts", router);
};
