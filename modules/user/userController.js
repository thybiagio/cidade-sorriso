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