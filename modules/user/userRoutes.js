var express = require("express");
var router = express.Router();
const userController = require("./userController");
const authMiddleware = require("../../middlewares/auth");
const upload = require("../../middlewares/profileMulter");
const postController = require("../post/postController");

router.get("/register", (req, res) => res.render("register"));
router.post("/register", userController.register);

router.get("/login", (req, res) => res.render("login"));
router.post("/login", userController.login);

router.get("/logout", userController.logout);

router.get("/timeline", authMiddleware, async (req, res) => {
    try {
        const posts = await postController.getAllPosts();
        res.render("timeline", { posts }); // Envia a lista de posts para o EJS
    } catch (error) {
        console.error("Erro ao carregar a timeline:", error);
        req.flash("error", "Erro ao carregar as lembranças do Clube.");
        res.redirect("/");
    }
});

router.get("/profile/edit", authMiddleware, async (req, res) => res.render("edit-profile"));
router.post("/profile/edit", authMiddleware, upload.single("profilePicture"), userController.updateProfile);
router.get("/profile", authMiddleware, userController.showProfile);
router.get("/profile/:id", authMiddleware, userController.showProfile);

module.exports = router;
