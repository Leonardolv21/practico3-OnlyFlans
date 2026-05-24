const { Router } = require("express");
const requireAuth = require("../middlewares/user.middleware");
const requireRole = require("../middlewares/role.middleware");
const schemaValidation = require("../middlewares/schemaValidation.middleware");
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware");
const { uploadCreatorImages } = require("../middlewares/upload.middleware");
const controller = require("../controllers/creator.controller");
const { createGoalSchema, updateGoalSchema } = require("../validators/creator.schema");

module.exports = (app) => {
    const router = Router();

    router.put("/me/profile", requireAuth, requireRole("creator"), uploadCreatorImages, controller.putMyProfile);
    router.post("/me/goals", requireAuth, requireRole("creator"), isJsonRequestValid, schemaValidation(createGoalSchema), controller.postMyGoal);
    router.get("/me/goals", requireAuth, requireRole("creator"), controller.getMyGoals);
    router.patch("/me/goals/:goalId", requireAuth, requireRole("creator"), isJsonRequestValid, schemaValidation(updateGoalSchema), controller.patchMyGoal);
    router.delete("/me/goals/:goalId", requireAuth, requireRole("creator"), controller.deleteMyGoal);
    router.get("/me/dashboard", requireAuth, requireRole("creator"), controller.getMyDashboard);
    router.get("/me/income", requireAuth, requireRole("creator"), controller.getMyIncomeReport);
    router.get("/search", controller.getCreatorSearch);
    router.get("/:id/profile", controller.getCreatorProfile);
    router.get("/:id/posts", requireAuth, controller.getCreatorPosts);

    app.use("/creators", router);
};
