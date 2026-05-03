var express = require("express");
var router = express.Router();
const postController = require("./postController");
const authMiddleware = require("../../middlewares/auth");
const uploadPost = require("../../middlewares/postMulter");
const upload = require("../../middlewares/profileMulter");

//Mostra o formulário de Nova Publicação
router.get("/upload", authMiddleware, (req, res) => { 
    res.render("upload");
});

//Recebe os dados, passa pelo Multer (single image) e salva no banco

// O número 10 é o limite máximo de fotos por carrossel!
router.post("/upload", authMiddleware, uploadPost.array("images", 10), postController.uploadPost);

module.exports = router;
