import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

const generateToken = (user: { _id: string; isAdmin: boolean }) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email já cadastrado." });

    const user = await User.create({ name, email, password });

    const token = generateToken({ _id: user._id.toString(), isAdmin: user.isAdmin });

    res.status(201).json({ token, userId: user._id, name: user.name, email: user.email });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: "Erro ao registrar usuário." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Credenciais inválidas." });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: "Credenciais inválidas." });

    const token = generateToken({ _id: user._id.toString(), isAdmin: user.isAdmin });

    res.json({ token, userId: user._id, name: user.name, email: user.email });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: "Erro interno ao logar." });
  }
};
