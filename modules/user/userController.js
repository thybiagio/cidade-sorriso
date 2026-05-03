const User = require("./userModel");
const Post = require("../post/postModel");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// 1. REGISTAR NOVA FICHA
exports.register = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;
        
        // Criptografa a senha antes de salvar no banco
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await User.create({ fullName, username, email, password: hashedPassword });
        
        req.flash("success", "Ficha criada com sucesso! Agora podes entrar.");
        res.redirect("/login");
    } catch (e) {
        console.error(e);
        req.flash("error", "Erro ao criar conta. O Username ou E-mail já podem estar em uso.");
        res.redirect("/register");
    }
};

// 2. FAZER LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            req.flash("error", "E-mail ou senha incorretos.");
            return res.redirect("/login");
        }

        // Verifica se a senha bate com a senha criptografada do banco
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            req.flash("error", "E-mail ou senha incorretos.");
            return res.redirect("/login");
        }

        // Salva os dados básicos do desbravador na sessão
        req.session.user = {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            isAdmin: user.isAdmin
        };

        res.redirect("/timeline");
    } catch (e) {
        console.error(e);
        req.flash("error", "Erro interno ao tentar fazer login.");
        res.redirect("/login");
    }
};

// 3. FAZER LOGOUT
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
};

// 4. OBTER PERFIL (Uso interno do sistema para recarregar a sessão)
exports.getProfile = async (id) => {
    return await User.findByPk(id, {
        attributes: { exclude: ['password'] } // Nunca retorna a senha!
    });
};

// 5. EXIBIR PORTFÓLIO PÚBLICO (A nova tela de Perfil Oficial)
exports.renderPublicProfile = async (req, res) => {
    try {
        const username = req.params.username;
        const profileUser = await User.findOne({
            where: { username },
            include: [{ model: Post, order: [["createdAt", "DESC"]] }]
        });

        if (!profileUser) {
            req.flash("error", "Desbravador não encontrado.");
            return res.redirect("/timeline");
        }

        const isOwner = req.session.user && req.session.user.id === profileUser.id;
        res.render("profile", { title: `@${profileUser.username} | Cidade Sorriso`, profileUser, isOwner });
    } catch (e) {
        console.error(e);
        req.flash("error", "Erro ao carregar a ficha do desbravador.");
        res.redirect("/timeline");
    }
};

// 6. EDITAR PERFIL (Apenas a foto é permitida)
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const oldUser = await User.findByPk(userId);

        if (req.file) {
            // Apaga a foto antiga do servidor se não for a padrão
            if (oldUser.profilePicture && oldUser.profilePicture !== 'default-profile.png') {
                const oldPath = path.join(__dirname, '../../public/uploads/avatares', oldUser.profilePicture);
                fs.unlink(oldPath, (err) => { if (err) console.error("Erro ao apagar imagem antiga:", err); });
            }

            // Atualiza no banco e na sessão
            await User.update({ profilePicture: req.file.filename }, { where: { id: userId } });
            req.session.user.profilePicture = req.file.filename;
        }

        req.flash("success", "Foto atualizada com sucesso!");
        res.redirect(`/profile/${req.session.user.username}`);
    } catch (e) {
        console.error(e);
        req.flash("error", "Erro ao atualizar a foto.");
        res.redirect("/profile/edit");
    }
};