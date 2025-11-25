import { Request, Response } from "express";
import { Book } from "../models/Book";

export interface AuthenticatedRequest extends Request {
  user?: any; // Usuário completo do MongoDB (inclui isAdmin)
}

const BASE_URL =
  process.env.API_URL ||
  process.env.BASE_URL ||
  "http://localhost:3000";

/* ============================================================
   GET /books — Listar livros
============================================================ */
export const getBooks = async (_req: Request, res: Response) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar livros", err });
  }
};

/* ============================================================
   GET /books/:id — Buscar livro por ID
============================================================ */
export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Livro não encontrado" });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: "ID inválido", err });
  }
};

/* ============================================================
   POST /books — Criar livro
============================================================ */
export const createBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(403).json({ message: "Usuário não autenticado" });

    const {
      title,
      author,
      description,
      fullText,
      isPhysical = false,
      copyCount = 0,
      shelfLocation = null,
    } = req.body;

    const coverImage = req.file
      ? `${BASE_URL}/uploads/covers/${req.file.filename}`
      : null;

    const book = await Book.create({
      title,
      author,
      description,
      fullText: isPhysical === true || isPhysical === 'true' ? null : fullText || null,
      isPhysical: isPhysical === true || isPhysical === 'true',
      copyCount: isPhysical === true || isPhysical === 'true' ? Number(copyCount) : 0,
      shelfLocation: isPhysical === true || isPhysical === 'true' ? shelfLocation : null,
      isAvailable:
        isPhysical === true || isPhysical === 'true' ? Number(copyCount) > 0 : true,
      coverImage,
      user: req.user._id,
    });

    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Erro ao criar livro", err });
  }
};


/* ============================================================
   PUT /books/:id — Atualizar livro
============================================================ */
export const updateBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const bookId = req.params.id;

    const existing = await Book.findById(bookId);
    if (!existing) return res.status(404).json({ message: "Livro não encontrado" });

    // ✅ Permite admin ou dono do livro
    if (!req.user?.isAdmin && existing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Proibido atualizar livro de outro usuário." });
    }

    if (req.file) {
      req.body.coverImage = `${BASE_URL}/uploads/covers/${req.file.filename}`;
    }

    if (req.body.copyCount !== undefined && existing.isPhysical) {
      req.body.isAvailable = req.body.copyCount > 0;
    }

    const updated = await Book.findByIdAndUpdate(
      bookId,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Erro ao atualizar livro", err });
  }
};

/* ============================================================
   DELETE /books/:id — Deletar livro
============================================================ */
export const deleteBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const bookId = req.params.id;

    const existing = await Book.findById(bookId);
    if (!existing) return res.sendStatus(204);

    // ✅ Permite admin ou dono do livro
    if (!req.user?.isAdmin && existing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Proibido deletar livros de outro usuário." });
    }

    await Book.findByIdAndDelete(bookId);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Erro ao deletar livro", err });
  }
};

/* ============================================================
   GET /books/:id/read — Ler livro digital
============================================================ */
export const readBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Livro não encontrado." });

    if (book.isPhysical)
      return res.status(400).json({ message: "Este livro é físico e não possui versão digital." });

    if (!book.fullText)
      return res.status(404).json({ message: "Este livro digital ainda não possui conteúdo." });

    return res.status(200).json({
      title: book.title,
      author: book.author,
      content: book.fullText,
    });
  } catch (error) {
    console.error("Erro ao ler livro:", error);
    return res.status(500).json({ message: "Erro interno ao tentar ler o livro." });
  }
};
