const { findUserById } = require("../services/user.service");
const { verifyToken } = require("../utils/jwt.utils");

const AUTH_COOKIE_NAME = "auth_token";

const getTokenFromRequest = (req) => {
    if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
        return req.cookies[AUTH_COOKIE_NAME];
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return null;
    }

    const splittedHeader = authHeader.split(" ");
    if (splittedHeader.length !== 2 || splittedHeader[0] !== "Bearer") {
        return null;
    }

    return splittedHeader[1];
};

const requireAuth = async (req, res, next) => {
    const token = getTokenFromRequest(req);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = verifyToken(token);
    if (!payload) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await findUserById(payload.id);
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
};
module.exports = requireAuth;
