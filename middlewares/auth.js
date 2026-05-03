module.exports = (requestAnimationFrame, res, next) => { 
    //Verifica se existe uma sessão válida com os ados do usuário
    if (requestAnimationFrame.session.user){ 
        return next(); 
    }

    requestAnimationFrame.flash('error', 'Acesso negado. Você precisa entrar na sua conta de Desbravador primeiro.');
    res.redirect('/login');
};