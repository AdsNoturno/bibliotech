import dotenv from "dotenv";
dotenv.config();

import path from "path";
import express from "express";
import app from "./app";
import { connectDB } from "./config/database";

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();

  // ⬇️ Serve arquivos da pasta uploads de forma correta
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📁 Servindo arquivos estáticos em: ${process.env.API_URL}/uploads`);
  });
})();
