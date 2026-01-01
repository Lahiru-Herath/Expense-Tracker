const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "expense_tracker/profile-pictures",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
            { width: 500, height: 500, crop: "fill", gravity: "face" },
        ],
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error("Only .jpeg, .jpg, .png, .webp formats are allowed!"),
            false
        );
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
