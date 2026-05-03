const User = require('./userModel');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const Post = require('../post/postModel');

exports.register = async (req, res) => {
    //Recebemos TODOS os dados do formulário de registro
    const { username, email, password, confirmPassword, fullName, unidade, dataNascimento, classes } = req.body;

    try{ 
        if (password !== confirmPassword) { 
            req.flash('error','As senhas não coincidem.');
            return res.redirect('/register');
        }

        const emailExists = await User.findOne({ where: { email } });
        const usernameExists = await User.findOne({ where: { username } });

        if (emailExists || usernameExists) {
            req.flash('error','E-mail ou nome de usuário já cadastrados.');
            return res.redirect('/register');
        }

        // Hash da senha usando bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Salvar no banco incluindo os dados específicos do Desbravador
        await User.create({
            username,
            email,
            password: hashedPassword,
            fullName,
            unidade,
            dataNascimento,
            classes
        });

        req.flash('success', 'Cadastro realizado com sucesso! Faça seu login para acessar sua conta.');
        res.redirect('/login');
    } catch (error) { 
        console.error(error);
        req.flash('error', 'Erro ao criar conta. Verifique os dados e tente novamente.');
        res.redirect('/register');
    }
};  

exports.login = async (req, res) => {
    try { 
        const { login, password } = req.body;

        // Desbravador acessa com email ou username
        const user = await User.findOne({
            where: { 
                [require('sequelize').Op.or]: [{ email: login}, { username: login}]
            }
        });

        // Se não achou o usuário, ou a senha criptografada não bate
        if (!user || !(await bcrypt.compare(password, user.password))) {
            req.flash('error', 'E-mail/Usuário ou senha incorretos. Tente novamente.');
            return res.redirect('/login');
        }

        // Busca a ficha completa do Desbravador (incluindo a foto de perfil)
        // e salva TUDO na sessão. Isso garante que a Navbar funcione perfeitamente.
        const userData = await exports.getProfile(user.id);
        req.session.user = userData;
        // ----------------------

        res.redirect('/timeline');

    } catch (error) {
        console.error(error);
        req.flash('error', 'Ocorreu um erro no sistema. Tente novamente mais tarde.');
        res.redirect('/login');
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => { 
        res.redirect('/');
    });
};

//Busca os dadosdo desbravador para preencher a tela
exports.getProfile = async (userId) => { 
    try{ 
        const user = await User.findByPk(userId, {
            attributes: ['id','username', 'email', 'fullName', 'bio', 'profilePicture', 'unidade', 'classes', 'dataNascimento']
        });
        return user;
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao buscar perfil do desbravador.');
    }
};

exports.showProfile = async (req, res) => {
    try {
        const profileUser = await User.findByPk(req.params.id || req.session.user.id, {
            attributes: [
                'id',
                'username',
                'email',
                'fullName',
                'bio',
                'profilePicture',
                'unidade',
                'classes',
                'cargo',
                'dataNascimento',
                'postsCount'
            ],
            include: [{ model: Post }]
        });

        if (!profileUser) {
            req.flash('error', 'Perfil nÃ£o encontrado.');
            return res.redirect('/timeline');
        }

        res.render('profile', {
            profileUser,
            isOwner: req.session.user && Number(req.session.user.id) === Number(profileUser.id)
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Erro ao carregar perfil.');
        res.redirect('/timeline');
    }
};

//Recebe os dados novos a tela e salva no banco
exports.updateProfile = async (req, res) => {
    try {
        const { fullName, bio, dataNascimento } = req.body;
        const updateData = { fullName, bio, dataNascimento };
        const userId = req.session.user.id;

        
        // Pega a foto antiga antes de atualizar
        const oldUser = await User.findByPk(userId);

        if (req.file) {
            updateData.profilePicture = req.file.filename;
        }

        await User.update(updateData, { where: { id: userId } });
        
        // Se a foto mudou, exclui a antiga do disco!
        if (req.file && oldUser.profilePicture && oldUser.profilePicture !== 'default-profile.png') {
            const oldProfilePicPath = path.join(__dirname, '../../public/uploads/avatares', oldUser.profilePicture);
            fs.unlink(oldProfilePicPath, (err) => {
                if (err) console.error('Erro ao apagar avatar antigo:', err);
            });
        }

        // Atualiza a sessão para o navbar refletir a mudança na hora
        const userData = await exports.getProfile(userId);
        req.session.user = userData;

        req.flash('success', 'Ficha atualizada com sucesso!');
        res.redirect('/profile/edit');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Erro ao atualizar informações.');
        res.redirect('/profile/edit');
    }
};
