const User = require('./userModel');
const bcrypt = require('bcrypt');

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
    try{ 
        const { login, password } = req.body;

        //Desbravador acessa com email ou username
        const user = await User.findOne({
            where: { 
                [require('sequelize').Op.or]: [{ email: login}, { username: login}]
            }
    });

    // Se nãoi achou o usuário, ou a senha criptografada não bate
    if (!user || !(await bcrypt.compare(password, user.password))) {
        req.flash('error', 'E-mail/Usuário ou senha incorretos. Tente novamente.');
        return res.redirect('/login');
    }

    req.session.user = { 
        id: user.id,
        username: user.username,
        email: user.email,
        unidade: user.unidade,
        fullName: user.fullName,
    };

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