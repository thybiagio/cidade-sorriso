var express = require("express");
var router = express.Router();
const userController = require("./userController");
const authMiddleware = require("../../middlewares/auth");
const upload = require("../../middlewares/multer");

router.get("/register", (req, res) => res.render("register"));
router.post("/register", userController.register);

router.get("/login", (req, res) => res.render("login"));
router.post("/login", userController.login);

router.get("/logout", userController.logout);

router.get("/timeline", authMiddleware, async (req, res) => res.render("timeline"));

router.get("/profile/edit", authMiddleware, async (req, res) => res.render("edit-profile"));
router.post("/profile/edit", authMiddleware, upload.single("profilePicture"), userController.updateProfile);

module.exports = router;