var express = require('express');
var router = express.Router();
const userController = require('../modules/user/userController');

// Página Inicial Institucional
router.get('/', function (req, res, next) {
   res.render('index', { title: 'Disciplina, união e propósito' });
});

// Telas de Autenticação
router.get('/register', (req, res) => { res.render('register'); });
router.post('/register', userController.register); // Salva no banco!

router.get('/login', (req, res) => { res.render('login'); });

module.exports = router;