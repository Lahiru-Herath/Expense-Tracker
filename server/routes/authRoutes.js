const express = require("express");
const {
    registerUser,
    loginUser,
    getUserInfo,
    updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-user", protect, getUserInfo);
router.put("/update-profile", protect, updateProfile);

router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    // Cloudinary URL is available at req.file.path
    const imageUrl = req.file.path;
    res.status(200).json({ imageUrl });
});

module.exports = router;
