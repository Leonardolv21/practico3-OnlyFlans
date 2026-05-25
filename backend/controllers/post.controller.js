const postService = require("../services/post.service");

exports.createPost = async (req, res) => {
    const post = await postService.createPost(req.user.id, req.body, req.file);
    if (post.error === "POST_CONTENT_REQUIRED") {
        return res.status(400).json({ message: "Post must include text or image" });
    }
    res.status(201).json(post);
};

exports.createComment = async (req, res) => {
    const comment = await postService.addComment(req.params.id, req.user.id, req.body.text);
    if (comment.error === "POST_NOT_FOUND") {
        return res.status(404).json({ message: "Post not found" });
    }
    if (comment.error === "DONATION_REQUIRED") {
        return res.status(403).json({ message: "You must donate before commenting" });
    }
    res.status(201).json(comment);
};
