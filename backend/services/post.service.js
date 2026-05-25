const db = require("../models");
const creatorService = require("./creator.service");

const postService = {
    createPost: async (creatorId, payload, file) => {
        const text = payload.text ? payload.text.trim() : "";
        const uploadedImagePath = file ? `/uploads/posts/${file.filename}` : null;
        const imageUrl = uploadedImagePath || payload.image_url || null;

        if (!text && !imageUrl) {
            return { error: "POST_CONTENT_REQUIRED" };
        }

        return await db.post.create({
            text: text || null,
            image_url: imageUrl,
            creator_id: creatorId
        });
    },
    addComment: async (postId, followerId, text) => {
        const post = await db.post.findByPk(postId);
        if (!post) {
            return { error: "POST_NOT_FOUND" };
        }

        const canComment = await creatorService.canViewPosts(followerId, post.creator_id);
        if (!canComment) {
            return { error: "DONATION_REQUIRED" };
        }

        return await db.comment.create({
            text,
            post_id: postId,
            follower_id: followerId,
            creator_id: post.creator_id
        });
    }
};

module.exports = postService;
