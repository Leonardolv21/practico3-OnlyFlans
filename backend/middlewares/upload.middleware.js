const fs = require("fs");
const path = require("path");
const multer = require("multer");

const ensureDirectory = (directoryPath) => {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
};

const uploadsRoot = path.join(__dirname, "..", "uploads");
const profilePicturesPath = path.join(uploadsRoot, "profile_pictures");
const bannersPath = path.join(uploadsRoot, "banners");

ensureDirectory(profilePicturesPath);
ensureDirectory(bannersPath);

const storage = multer.diskStorage({
    destination: (_req, file, cb) => {
        if (file.fieldname === "profile_picture") {
            return cb(null, profilePicturesPath);
        }

        if (file.fieldname === "banner") {
            return cb(null, bannersPath);
        }

        return cb(new Error("Unsupported file field"));
    },
    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname || "").toLowerCase();
        const safeExtension = extension || ".jpg";
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExtension}`);
    }
});

const imageFileFilter = (_req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error("Only image files are allowed"));
    }

    cb(null, true);
};

const uploader = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const uploadCreatorImagesHandler = uploader.fields([
    { name: "profile_picture", maxCount: 1 },
    { name: "banner", maxCount: 1 }
]);

const uploadCreatorImages = (req, res, next) => {
    uploadCreatorImagesHandler(req, res, (error) => {
        if (!error) {
            return next();
        }

        return res.status(400).json({ message: error.message });
    });
};

module.exports = {
    uploadCreatorImages
};
