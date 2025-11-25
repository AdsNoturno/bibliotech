import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ReadBook = () => {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar livro do backend
  useEffect(() => {
    fetch(`http://localhost:3000/api/books/${id}/read`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar livro");
        return res.json();
      })
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao carregar o livro.");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-gray-300">Carregando livro...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10">
        <p className="text-red-400 text-xl mb-4">{error}</p>
        <Link
          to="/books"
          className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
        >
          Voltar ao Catálogo
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/70 backdrop-blur-xl border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-purple-400">{book.title}</h1>
          <p className="text-gray-400 text-sm">{book.author}</p>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-4">
          {/* Aumentar fonte */}
          <button
            onClick={() => setFontSize((prev) => Math.min(prev + 2, 40))}
            className="px-3 py-1 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            A+
          </button>

          {/* Diminuir */}
          <button
            onClick={() => setFontSize((prev) => Math.max(prev - 2, 12))}
            className="px-3 py-1 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            A-
          </button>

          {/* Line height */}
          <button
            onClick={() => setLineHeight((prev) => (prev === 1.6 ? 2 : 1.6))}
            className="px-3 py-1 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            {lineHeight === 1.6 ? "↑ Espaço" : "↓ Espaço"}
          </button>

          {/* Voltar */}
          <Link
            to={`/catalog`}
            className="px-3 py-1 bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Voltar
          </Link>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <div
          className="whitespace-pre-wrap"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
          }}
        >
          {book.content}
        </div>
      </div>
    </div>
  );
};

export default ReadBook;
