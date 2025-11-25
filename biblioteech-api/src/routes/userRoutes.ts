import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { protect, admin } from '../middlewares/authMiddlewares';

const router = Router();

// Apenas admins podem criar outros usuários/admins
router.post('/', protect, admin, createUser);

// Listar todos os usuários → somente admins
router.get('/', protect, admin, getUsers);

// Obter um usuário específico → somente admins
router.get('/:id', protect, admin, getUserById);

// Atualizar usuário → somente admins
router.put('/:id', protect, admin, updateUser);

// Deletar usuário → somente admins
router.delete('/:id', protect, admin, deleteUser);

export default router;
