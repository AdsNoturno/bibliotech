import API from './api';

// 1. Buscar todos os livros (Public)
export async function fetchBooks() {
  try {
    const res = await API.get('/books');
    return res.data;
  } catch (error) {
    throw new Error("Erro ao carregar livros.");
  }
}

// 2. Buscar livro por ID (Public)
export async function fetchBook(id) {
  try {
    const res = await API.get(`/books/${id}`);
    return res.data;
  } catch (error) {
    throw new Error("Livro não encontrado.");
  }
}

// 3. Criar livro (Protected)
export async function createBook(bookData) {
  try {
    const res = await API.post('/books', bookData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (error) {
    throw new Error(`Erro ao criar livro: ${error.response?.data?.message || error.message}`);
  }
}


// 4. Atualizar livro (Protected)
export async function updateBook(id, updates) {
  try {
    const res = await API.put(`/books/${id}`, updates);
    return res.data;
  } catch (error) {
    throw new Error(`Erro ao atualizar livro: ${error.response?.data?.message || error.message}`);
  }
}

// 5. Deletar livro (Protected)
export async function deleteBook(id) {
  try {
    await API.delete(`/books/${id}`);
  } catch (error) {
    throw new Error(`Erro ao deletar livro: ${error.response?.data?.message || error.message}`);
  }
}
