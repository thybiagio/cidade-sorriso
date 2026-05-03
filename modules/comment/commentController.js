const Comment = require("./commentModel");
const Post = require("../post/postModel");
const User = require("../user/userModel");

exports.addComment = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.session.user.id;

    // Validação básica: não aceitar comentário vazio
    if (!content || content.trim() === "") {
        return res.status(400).json({ message: "Escreve alguma coisa para comentar!" });
    }

    try {
        // Cria o comentário no banco
        const comment = await Comment.create({
            content: content.trim(),
            userId,
            postId
        });

        // Aumenta o contador de comentários no post
        await Post.increment("commentsCount", { where: { id: postId } });

        // Buscamos o comentário que acabamos de criar, mas INCLUÍMOS o autor
        // Isso serve para a gente mandar o nome e a foto de quem comentou de volta para a tela
        const newComment = await Comment.findByPk(comment.id, {
            include: [{
                model: User,
                attributes: ["username", "fullName", "profilePicture"]
            }]
        });

        res.status(201).json({ message: "Comentário enviado!", comment: newComment });
    } catch (error) {
        console.error("Erro ao adicionar comentário:", error);
        res.status(500).json({ message: "Erro interno ao comentar." });
    }
};

exports.getComments = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await Comment.findAll({
            where: { postId },
            include: [{
                model: User,
                attributes: ["username", "fullName", "profilePicture"]
            }],
            order: [["createdAt", "DESC"]] // Mais recentes primeiro
        });
        res.status(200).json({ comments });
    } catch (error) {
        console.error("Erro ao buscar comentários:", error);
        res.status(500).json({ message: "Erro ao carregar comentários." });
    }
};