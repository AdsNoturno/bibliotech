import express from 'express';
import cors from 'cors';
import bookRoutes from './routes/bookRoutes'; 
import authRoutes from './authRoutes'; 
import feedbackRoutes from './routes/feedbackRoutes';


// Cria a instância principal do Express
const app = express();

// =====================================================
// MIDDLEWARES GLOBAIS
// =====================================================

// 1. Configuração Robusta do CORS
// Permite que o Front-End (rodando na porta 5173 ou similar, geralmente do Vite) se comunique.
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173']; // Adicione outras origens se necessário

const corsOptions = {
  origin: (origin: any, callback: any) => {
    // Permite requisições sem origem (como apps mobile ou curl)
    if (!origin) return callback(null, true); 
    // Permite origens na lista
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Permite todos os métodos necessários
  credentials: true, // Importante para cookies/auth
};

app.use(cors(corsOptions)); // Aplica a política de CORS
app.use(express.json()); // Body parser para JSON

// 2. Middleware de Segurança (Helmet) - BOA PRÁTICA


// =====================================================
// CONEXÃO DE ROTAS
// =====================================================

app.get('/', (_req, res) => {
    res.send({ message: 'API da Biblioteca rodando com sucesso!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes); 
app.use('/api/feedback', feedbackRoutes);

// =====================================================
// EXPORTAÇÃO
// =====================================================
export default app;