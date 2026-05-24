const Joi = require("joi");

const createPostSchema = Joi.object({
    text: Joi.string().allow(null, ""),
    image_url: Joi.string().uri().allow(null, "")
}).custom((value, helpers) => {
    if (!value.text && !value.image_url) {
        return helpers.error("any.invalid");
    }

    return value;
}, "post content validation").messages({
    "any.invalid": "Post must include text or image"
});

const createCommentSchema = Joi.object({
    text: Joi.string().min(1).max(1000).required()
});

module.exports = {
    createPostSchema,
    createCommentSchema
};
