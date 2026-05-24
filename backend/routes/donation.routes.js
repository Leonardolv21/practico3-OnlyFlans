const { Router } = require("express");
const requireAuth = require("../middlewares/user.middleware");
const requireRole = require("../middlewares/role.middleware");
const schemaValidation = require("../middlewares/schemaValidation.middleware");
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware");
const controller = require("../controllers/donation.controller");
const { createDonationSchema } = require("../validators/donation.schema");

module.exports = (app) => {
    const router = Router();

    router.post("/", requireAuth, requireRole("follower"), isJsonRequestValid, schemaValidation(createDonationSchema), controller.createDonation);
    router.get("/history", requireAuth, requireRole("follower"), controller.getMyDonationHistory);

    app.use("/donations", router);
};
