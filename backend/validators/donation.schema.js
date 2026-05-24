const Joi = require("joi");

const createDonationSchema = Joi.object({
    creator_id: Joi.number().integer().positive().required(),
    flan_count: Joi.number().integer().min(1).required(),
    support_type: Joi.string().trim().min(1).max(50).default("flan")
});

module.exports = {
    createDonationSchema
};
