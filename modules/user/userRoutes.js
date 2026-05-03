const express = require("express");
const router = express.Router();
const userController = require("./userController");
const postController = require("../post/postController"); // Importa o controlador de posts
const authMiddleware = require("../../middlewares/auth");
const upload = require("../../config/multer");

// ==========================================
// 1. ROTAS DE AUTENTICAÇÃO (Públicas)
// ==========================================

// Exibir as telas
router.get("/register", (req, res) => res.render("register", { title: "Nova Ficha | Cidade Sorriso" }));
router.get("/login", (req, res) => res.render("login", { title: "Entrar | Cidade Sorriso" }));

// Ações do formulário
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);


// ==========================================
// 2. LINHA DO TEMPO (Protegida)
// ==========================================
router.get("/timeline", authMiddleware, async (req, res) => {
    try {
        const posts = await postController.getAllPosts();
        res.render("timeline", { title: "Álbum do Clube", posts });
    } catch (error) {
        console.error("Erro ao carregar a timeline:", error);
        req.flash("error", "Erro ao carregar as lembranças do Clube.");
        res.redirect("/");
    }
});


// ==========================================
// 3. GESTÃO DE PERFIL (Protegidas)
// ==========================================

// Exibir tela de alterar foto
router.get("/profile/edit", authMiddleware, (req, res) => {
    // Passamos o utilizador logado (da sessão) para a página
    res.render("edit-profile", { title: "Alterar Foto", user: req.session.user });
});

// Ação de salvar a nova foto
router.post("/profile/edit", authMiddleware, upload.single("profilePicture"), userController.updateProfile);

// Exibir a Ficha/Portfólio Oficial (ATENÇÃO: Esta rota tem de ficar no fim para não dar conflito com a /edit)
router.get("/profile/:username", authMiddleware, userController.renderPublicProfile);


module.exports = router;