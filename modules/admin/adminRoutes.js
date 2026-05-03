const express = require('express');
const router = express.Router();
const adminController = require('./adminController');
const authMiddleware = require('../../middlewares/auth');

// Middleware extra: Só deixa passar se for Diretor ou Secretário
const adminOnly = (req, res, next) => {
    const permitidos = ['Diretor', 'Secretário', 'Diretor associado'];
    if (req.session.user && permitidos.includes(req.session.user.cargoClube)) {
        return next();
    }
    req.flash('error', 'Acesso restrito à diretoria.');
    res.redirect('/timeline');
};

router.get('/admin/membros', authMiddleware, adminOnly, adminController.renderGerenciarMembros);
router.post('/admin/membro/:id/update', authMiddleware, adminOnly, adminController.atualizarMembro);

module.exports = router;