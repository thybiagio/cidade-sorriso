var express = require('express');
var router = express.Router();
const userController = require('../modules/user/userController');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/multer'); // Nosso gerenciador de fotos

// ROTAS PÚBLICAS
router.get('/', function (req, res, next) { res.render('index', { title: 'Disciplina, união e propósito' }); });
router.get('/register', (req, res) => { res.render('register'); });
router.post('/register', userController.register);
router.get('/login', (req, res) => { res.render('login'); });
router.post('/login', userController.login);
router.get('/logout', userController.logout);

// ROTAS PRIVADAS
router.get('/timeline', authMiddleware, async (req, res) => {
   const user = await userController.getProfile(req.session.user.id);
   res.render('timeline', { user }); 
});

// A Rota GET busca os dados e exibe a tela de edição
router.get('/profile/edit', authMiddleware, async (req, res) => {
    const user = await userController.getProfile(req.session.user.id);
    res.render('edit-profile', { user });
});

// A Rota POST recebe os dados, passa pelo Multer para salvar a foto, e depois pelo Controller
router.post('/profile/edit', authMiddleware, upload.single('profilePicture'), userController.updateProfile);

module.exports = router;