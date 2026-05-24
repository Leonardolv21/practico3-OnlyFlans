const Joi = require("joi");

const upsertCreatorProfileSchema = Joi.object({
    profile_picture: Joi.string().uri().allow(null, ""),
    banner: Joi.string().uri().allow(null, "")
});

const createGoalSchema = Joi.object({
    title: Joi.string().min(1).max(120).required(),
    description: Joi.string().min(1).max(1000).required(),
    is_active: Joi.boolean().optional()
});

const updateGoalSchema = Joi.object({
    title: Joi.string().min(1).max(120).optional(),
    description: Joi.string().min(1).max(1000).optional(),
    is_active: Joi.boolean().optional()
}).min(1);

module.exports = {
    upsertCreatorProfileSchema,
    createGoalSchema,
    updateGoalSchema
};
