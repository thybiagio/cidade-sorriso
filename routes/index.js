var express = require('express');
var router = express.Router();
const userController = require('../modules/user/userController');
const authMiddleware = require('../middlewares/auth'); // O nosso segurança

// --- ROTAS PÚBLICAS (Institucional) ---
router.get('/', function (req, res, next) {
   res.render('index', { title: 'Disciplina, união e propósito' });
});

router.get('/register', (req, res) => { res.render('register'); });
router.post('/register', userController.register);

router.get('/login', (req, res) => { res.render('login'); });
router.post('/login', userController.login); // Agora processa o login!
router.get('/logout', userController.logout); // Botão de sair


// --- ROTAS PRIVADAS (Área do Membro) ---
// Note o "authMiddleware" no meio, barrando quem não tem sessão
router.get('/timeline', authMiddleware, (req, res) => {
   res.render('timeline', { user: req.session.user });
});

module.exports = router;