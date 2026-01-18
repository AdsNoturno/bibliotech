import axios from "axios";

// Base URL do backend (ajuste a porta se necessário)
const API = axios.create({
  baseURL: "https://bibliotech-api.onrender.com",
  timeout: 5000, // 5s de timeout
});

// Interceptor para enviar token automaticamente em rotas protegidas
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ======================
// FUNÇÕES DE LIVROS
// ======================

// Buscar todos os livros
export const getBooks = async () => {
  const res = await API.get("/books");
  return res.data;
};

// Buscar livro por ID
export const getBookById = async (id) => {
  const res = await API.get(`/books/${id}`);
  return res.data;
};

// Criar livro (rota protegida)
export const createBook = async (payload) => {
  const res = await API.post("/books", payload);
  return res.data;
};

  

// Atualizar livro (rota protegida)
export const updateBook = async (id, payload) => {
  const res = await API.put(`/books/${id}`, payload);
  return res.data;
};

// Deletar livro (rota protegida)
export const deleteBook = async (id) => {
  const res = await API.delete(`/books/${id}`);
  return res.data;
};
export const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user;
}

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.isAdmin === true;
};


// ======================
// EXPORT DEFAULT
// ======================
export default API;
