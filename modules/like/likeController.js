const Like = require('./likeModel');
const Post = require('../post/postModel'); // Mudamos de Video para Post

exports.toggleLike = async (req, res) => {
    const { postId } = req.params; // Pegamos o ID do post da URL
    const userId = req.session.user.id; // Pegamos o ID do desbravador logado

    try {
        // O findOrCreate tenta achar o like. Se não achar, ele cria.
        const [like, created] = await Like.findOrCreate({
            where: { userId, postId },
            defaults: { userId, postId }
        });

        if (!created) {
            // Se NÃO foi criado agora (já existia), então o usuário quer "descurtir"
            await like.destroy();
            // Diminuímos o contador de likes no Post
            await Post.decrement('likesCount', { where: { id: postId } });
            return res.status(200).json({ liked: false, message: 'Like removido.' });
        } else {
            // Se FOI criado, o usuário acabou de curtir
            await Post.increment('likesCount', { where: { id: postId } });
            return res.status(201).json({ liked: true, message: 'Like adicionado!' });
        }
    } catch (error) {
        console.error('Erro ao processar like:', error);
        res.status(500).json({ message: 'Erro interno ao processar curtida.' });
    }
};