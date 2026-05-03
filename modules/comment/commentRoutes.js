const express = require("express");
const router = express.Router();
const commentController = require("./commentController");
const authMiddleware = require("../../middlewares/auth");

// Rota para adicionar um novo comentário
router.post("/post/:postId/comment", authMiddleware, commentController.addComment);

// Rota para buscar todos os comentários de um post
router.get("/post/:postId/comments", authMiddleware, commentController.getComments);

module.exports = router;