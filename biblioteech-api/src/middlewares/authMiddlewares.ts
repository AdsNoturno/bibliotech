import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface AuthenticatedRequest extends Request {
  user?: any; // Usuário completo
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido ou inválido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };

    // Carrega o usuário completo do banco (menos a senha)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Usuário não encontrado.' });

    req.user = user; // ✅ Disponível para os controllers
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
  
};
export const admin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Acesso negado. Apenas admins.' });
  }
};

