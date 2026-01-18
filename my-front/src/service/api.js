import axios from "axios";

// 1. AJUSTE DA URL: Adicionado o /api no final
const API = axios.create({
  baseURL: "https://bibliotech-api.onrender.com/api", 
  timeout: 5000, 
});

// Interceptor para enviar token automaticamente
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

// O axios já usa a baseURL, então chamamos apenas /books
export const getBooks = async () => {
  const res = await API.get("/books");
  return res.data;
};

export const getBookById = async (id) => {
  const res = await API.get(`/books/${id}`);
  return res.data;
};

export const createBook = async (payload) => {
  const res = await API.post("/books", payload);
  return res.data;
};

export const updateBook = async (id, payload) => {
  const res = await API.put(`/books/${id}`, payload);
  return res.data;
};

export const deleteBook = async (id) => {
  const res = await API.delete(`/books/${id}`);
  return res.data;
};

// ======================
// FUNÇÕES DE USUÁRIO
// ======================

export const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user;
}

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin' || user?.isAdmin === true;
};

export default API;