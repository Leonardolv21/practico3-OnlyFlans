const { generateToken } = require("../utils/jwt.utils");
const { hashPassword, comparePassword } = require("../utils/text.utils");
const userService = require("../services/user.service");

const AUTH_COOKIE_NAME = "auth_token";

const buildAuthCookieConfig = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 60 * 60 * 1000
});

exports.postRegister = async (req, res) => {
    const { name, email, password, role } = req.body;
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: "Email is already registered" });
    }
    const encodedPassword = await hashPassword(password);
    const user = await userService.createUser(name, email, encodedPassword, role);
    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken({
        id: user.id,
    });
    res.cookie(AUTH_COOKIE_NAME, token, buildAuthCookieConfig());

    res.status(200).json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

exports.postLogout = async (_req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME, buildAuthCookieConfig());
    res.status(200).json({ message: "Logout successful" });
};
