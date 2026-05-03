const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 1. Definir onde as pastas vão ficar
const avataresPath = path.join(__dirname, "../public/uploads/avatares");
const timelinePath = path.join(__dirname, "../public/uploads/timeline");

// 2. Criar as pastas automaticamente se elas não existirem (evita erros no primeiro uso)
if (!fs.existsSync(avataresPath)) fs.mkdirSync(avataresPath, { recursive: true });
if (!fs.existsSync(timelinePath)) fs.mkdirSync(timelinePath, { recursive: true });

// 3. Configurar a "inteligência" de armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Se a foto vier do formulário de perfil, vai para a pasta de avatares
        if (file.fieldname === "profilePicture") {
            cb(null, avataresPath);
        } else {
            // Se for uma foto de acampamento, vai para a timeline
            cb(null, timelinePath);
        }
    },
    filename: (req, file, cb) => {
        // Cria um nome único para não substituir fotos com o mesmo nome (ex: img01.jpg)
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});

// Exporta o configurador pronto a usar
module.exports = multer({ storage });