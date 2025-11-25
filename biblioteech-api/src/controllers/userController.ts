import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';

interface AuthenticatedRequest extends Request {
  user?: any; // Usuário logado (inclui isAdmin)
}

// Função utilitária para gerar hash SHA-256
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// ------------------------------------------------------------------
// 1. CRIAR USUÁRIO (POST /api/users)
// Apenas admins podem criar outro admin
// ------------------------------------------------------------------
export const createUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, isAdmin: requestedAdmin } = req.body;

    // Verifica duplicidade de e-mail
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'Conflito: Este e-mail já está cadastrado.' });
      return;
    }

    // Apenas admins podem criar outro admin
    let isAdmin = false;
    if (req.user?.isAdmin && requestedAdmin === true) {
      isAdmin = true;
    }

    const newUser = new User({
      name,
      email,
      password: hashPassword(password),
      isAdmin,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      res.status(409).json({ message: 'Conflito: E-mail já existente.' });
    } else if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erro ao criar usuário.', error });
    }
  }
};

// ------------------------------------------------------------------
// 2. LISTAR TODOS OS USUÁRIOS (GET /api/users)
// Apenas admins podem listar
// ------------------------------------------------------------------
export const getUsers = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar usuários.', error });
  }
};

// ------------------------------------------------------------------
// 3. OBTÉM USUÁRIO POR ID (GET /api/users/:id)
// Apenas admins podem acessar qualquer usuário
// ------------------------------------------------------------------
export const getUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId, { password: 0 });

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error && 'name' in error && error.name === 'CastError') {
      res.status(400).json({ message: 'ID de usuário inválido.' });
    } else {
      res.status(500).json({ message: 'Erro ao buscar usuário.', error });
    }
  }
};

// ------------------------------------------------------------------
// 4. ATUALIZAR USUÁRIO (PUT/PATCH /api/users/:id)
// Apenas admins podem atualizar qualquer usuário
// ------------------------------------------------------------------
export const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.isAdmin) {
      res.status(403).json({ message: 'Acesso negado. Apenas admins.' });
      return; // apenas interrompe a execução
    }

    const userId = req.params.id;
    const updateData: any = { ...req.body };

    // Se for alterar a senha, aplica hash
    if (updateData.password) {
      updateData.password = hashPassword(updateData.password);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: 'Usuário não encontrado para atualização.' });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    } else if (error instanceof Error && 'name' in error && error.name === 'CastError') {
      res.status(400).json({ message: 'ID de usuário inválido.' });
    } else {
      res.status(500).json({ message: 'Erro ao atualizar usuário.', error });
    }
  }
};

// ------------------------------------------------------------------
// 5. DELETAR USUÁRIO (DELETE /api/users/:id)
// Apenas admins podem deletar
// ------------------------------------------------------------------
export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.isAdmin) {
      res.status(403).json({ message: 'Acesso negado. Apenas admins.' });
      return;
    }

    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      res.status(404).json({ message: 'Usuário não encontrado para exclusão.' });
      return;
    }

    res.status(204).send(); // ✅ envia status 204 sem corpo
  } catch (error) {
    if (error instanceof Error && 'name' in error && error.name === 'CastError') {
      res.status(400).json({ message: 'ID de usuário inválido.' });
    } else {
      res.status(500).json({ message: 'Erro ao excluir usuário.', error });
    }
  }
};
