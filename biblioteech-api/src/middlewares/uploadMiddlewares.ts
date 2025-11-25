import multer from "multer";
import path from "path";
import fs from "fs";

// Caminho absoluto na pasta raiz do projeto
const uploadDir = path.join(process.cwd(), "uploads", "covers");

// Criar pasta de uploads se não existir
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    },
});

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Formato de imagem não permitido"));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
