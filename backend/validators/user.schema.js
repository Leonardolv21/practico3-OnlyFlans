const Joi = require("joi");

const registerUserSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("creator", "follower").required()
});
const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
module.exports = {
    registerUserSchema,
    loginUserSchema
};
