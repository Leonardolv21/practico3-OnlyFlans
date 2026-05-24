const db = require("../models");
const creatorService = require("./creator.service");

const postService = {
    createPost: async (creatorId, payload) => {
        return await db.post.create({
            text: payload.text || null,
            image_url: payload.image_url || null,
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
