const express = require("express");
const router = express.Router();
const likeController = require("./likeController");
const authMiddleware = require("../../middlewares/auth");

// Rota para alternar o like (curtir/descurtir)
router.post("/post/:postId/toggle-like", authMiddleware, likeController.toggleLike);

module.exports = router;