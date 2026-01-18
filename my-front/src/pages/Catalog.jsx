import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChatWidget from "../components/ChatWidget";
import { getBooks } from "../service/api";
import { isAdmin } from "../service/auth"; 

const Catalog = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getBooks()
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Não foi possível carregar o catálogo.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFilteredBooks(
      books.filter(
        (b) =>
          b.title?.toLowerCase().includes(term) ||
          b.author?.toLowerCase().includes(term)
      )
    );
  }, [search, books]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 animate-pulse">Carregando livros...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md p-8 bg-gray-900 rounded-2xl border border-red-900/50 shadow-xl">
          <h2 className="text-2xl font-bold text-red-400 mb-2">Ops! Algo deu errado.</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-16">
      {/* HEADER */}
      <div className="text-center max-w-4xl mx-auto mb-16 relative">
        <Link
          to="/"
          className="absolute -top-6 left-0 px-3 py-2 bg-gray-800/80 hover:bg-gray-700 text-purple-300 font-medium rounded-lg shadow-md transition flex items-center gap-1"
        >
          ← Voltar
        </Link>

        <h1 className="text-6xl font-extrabold leading-tight mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-600 drop-shadow-[0_0_20px_rgba(168,85,247,0.35)]">
          Catálogo de Livros
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Pesquisar por título ou autor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 p-3 rounded-xl border border-gray-800 bg-gray-900/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
          />

          {isAdmin() && (
            <Link
              to="/books/new"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md shadow-purple-700/40 transition ease-out hover:scale-[1.03]"
            >
              + Adicionar Livro
            </Link>
          )}
        </div>
      </div>

      {/* SEM RESULTADOS */}
      {filteredBooks.length === 0 ? (
        
        <div className="text-center py-20 bg-gray-900/40 backdrop-blur-sm rounded-3xl border border-gray-800 max-w-3xl mx-auto shadow-xl">
          <p className="text-2xl text-gray-400 font-medium">Nenhum livro encontrado.</p>
          <p className="text-gray-500 mt-2">Que tal adicionar o primeiro?</p>
        </div>
        
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {filteredBooks.map((book) => (
            <div
              key={book._id || book.id}
              className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-lg hover:shadow-purple-500/60 transition hover:-translate-y-1 overflow-hidden group"
            >
              {/* CAPA */}
              <div
                className="h-96 bg-gray-800/50 flex items-center justify-center overflow-hidden cursor-pointer relative"
                onClick={() => navigate(`/books/${book._id || book.id}`)}
              >
                {book?.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/default-cover.png";
                    }}
                    className="h-full w-full object-cover transform group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-700 text-gray-300 text-5xl font-bold">
                    📚
                  </div>
                )}

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center p-4 text-center pointer-events-none">
                  <h3 className="text-lg font-bold text-purple-300 mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-1 line-clamp-1">
                    {book.author || "Autor desconhecido"}
                  </p>
                </div>
              </div>

              {/* BOTÕES */}
              <div className="p-4 flex gap-2">
                <button
                  onClick={() => navigate(`/books/${book._id || book.id}`)}
                  className="flex-1 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition shadow-md"
                >
                  Detalhes
                </button>

                {isAdmin() && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/books/${book._id || book.id}/edit`);
                    }}
                    className="flex-1 py-2 text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg font-medium transition shadow-md"
                  >
                    Editar
                  </button>
                )}

                {!book.isPhysical && (
                  <button
                    onClick={() => navigate(`/books/${book._id || book.id}/read`)}
                    className="flex-1 py-2 text-purple-700 bg-purple-200 hover:bg-purple-300 rounded-lg font-medium transition shadow-md"
                  >
                    Ler
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ChatWidget />
    </div>
  );
};

export default Catalog;
