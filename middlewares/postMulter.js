const multer = require("multer");
const path = require("path");

const postStorage = multer.diskStorage({ 
    destination: (req, file, cb) => {
        //Guarda as fotos da Linha do Tempo nesta pasta específica
        cb(null, "public/uploads/posts/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `post-${req.session.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const postFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Apenas arquivos de imagem são permitidos!"), false);
    }
};

const uploadPost = multer({ 
    storage: postStorage,
    fileFilter: postFileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // Limite de 10MB por foto
});

module.exports = uploadPost;