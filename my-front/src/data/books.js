export const API_URL = "http://localhost:3000/api/books";

export async function fetchBooks() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Erro ao buscar livros");
  }

  return await response.json();
}
