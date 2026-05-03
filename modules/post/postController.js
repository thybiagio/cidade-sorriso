exports.uploadPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.session.user.id;

        // Agora verificamos req.files (no plural) e se a lista está vazia
        if (!req.files || req.files.length === 0) {
            req.flash("error", "Por favor, selecione pelo menos uma foto.");
            return res.redirect("/upload");
        }

        // Extraímos apenas o nome (filename) de todas as fotos que o Multer salvou
        const imagePaths = req.files.map(file => file.filename);

        // 1. Cria a publicação no banco salvando a lista de fotos (JSON)
        await Post.create({
            title,
            description,
            images: imagePaths, // Aqui vai a nossa lista [foto1.jpg, foto2.jpg...]
            userId,
        });

        // 2. Aumenta o contador
        await User.increment('postsCount', { where: { id: userId } });

        req.flash("success", "Carrossel publicado com sucesso!");
        res.redirect("/timeline");
    } catch (error) {
        console.error("Erro ao publicar:", error);
        req.flash("error", "Erro ao publicar as fotos. Tente novamente.");
        res.redirect("/upload");
    }
};