import express from 'express';
import cors from 'cors';
import path from 'path';
import bookRoutes from './routes/bookRoutes'; 
import authRoutes from './authRoutes'; 
import feedbackRoutes from './routes/feedbackRoutes';

// Cria a instância principal do Express
const app = express();

// =====================================================
// MIDDLEWARES GLOBAIS
// =====================================================

// 1. Configuração de CORS simplificada para Produção
// O origin: true reflete a origem da requisição, facilitando o uso com Netlify
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://127.0.0.1:5173', 
    'https://bibliotechclient.netlify.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json()); // Body parser para JSON

// 2. Servir arquivos estáticos (Uploads de capas de livros, etc)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// =====================================================
// CONEXÃO DE ROTAS
// =====================================================

app.get('/', (_req, res) => {
    res.send({ message: 'API da Biblioteca rodando com sucesso!' });
});

// Suas rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes); 
app.use('/api/feedback', feedbackRoutes);

// =====================================================
// EXPORTAÇÃO
// =====================================================
export default app;