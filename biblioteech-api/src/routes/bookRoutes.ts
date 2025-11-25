import { Router } from "express";
import * as controller from "../controllers/bookController";
import { protect, admin } from "../middlewares/authMiddlewares"; 
import { upload } from "../middlewares/uploadMiddlewares";

const router = Router();

// Listar livros
router.get("/", controller.getBooks);

// Ler versão digital
router.get("/:id/read", controller.readBook);

// Buscar livro por ID
router.get("/:id", controller.getBookById);

// Criar livro → apenas admins
router.post(
  "/",
  protect,
  admin,
  upload.single("coverImage"),
  controller.createBook
);

// Atualizar livro → apenas admins
router.put(
  "/:id",
  protect,
  upload.single("coverImage"),
  controller.updateBook
);

// Deletar livro → apenas admins
router.delete("/:id", protect, admin, controller.deleteBook);

export default router;
