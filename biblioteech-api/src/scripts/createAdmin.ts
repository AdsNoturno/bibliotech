import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/database";
import User from "../models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

(async () => {
  await connectDB();

  const email = "admin@bibli.com";
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("⚠️ Admin já existe:", email);
    process.exit(0);
  }

  // NÃO use bcrypt aqui, deixe o 'pre-save' cuidar do hash
  const admin = new User({
    name: "Admin",
    email,
    password: "123",
    isAdmin: true,
  });

  await admin.save(); // aqui o pre-save vai gerar o hash

  const token = jwt.sign(
    { id: admin._id.toString(), isAdmin: admin.isAdmin },
    JWT_SECRET,
    { expiresIn: "30d" }
  );

  console.log("✅ Admin criado com sucesso!");
  console.log("Email:", admin.email);
  console.log("Senha:", "123");
  console.log("JWT Token:", token);

  process.exit(0);
})();
