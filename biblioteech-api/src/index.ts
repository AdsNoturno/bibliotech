import express, { Express } from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import bookRoutes from "./routes/bookRoutes";
import userRoutes from "./routes/userRoutes";

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 3000;

// MIDDLEWARES
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// ROTAS
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);

// SERVER + DATABASE
const startServer = async () => {
  try {
    await connectDB();
    console.log("📦 Banco conectado com sucesso!");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
  }
};

startServer();
