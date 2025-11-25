import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBook } from "../service/bookService";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBook(id)
        .then((data) => setBook(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-400">Carregando detalhes...</p>
        </div>
      </div>
    );

  if (!book)
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Livro não encontrado.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 pt-12 flex justify-center">
      <div className="max-w-5xl w-full bg-gray-900/40 border border-gray-800 rounded-3xl shadow-xl p-8 backdrop-blur-sm">
        
        {/* Título + Autor */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-purple-300 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            {book.title}
          </h1>
          <p className="text-gray-400 text-lg mt-2">
            {book.author || "Autor desconhecido"}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          
          {/* CAPA */}
          <div className="flex justify-center md:justify-start w-full md:w-1/3">
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl shadow-lg overflow-hidden w-60 h-80 flex items-center justify-center">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-500 text-6xl">📚</div>
              )}
            </div>
          </div>

          {/* INFO DO LIVRO */}
          <div className="flex-1 space-y-6">
            
            {/* Descrição */}
            {book.description && (
              <div>
                <h2 className="text-xl font-semibold text-purple-300 mb-2">Descrição</h2>
                <p className="text-gray-300 leading-relaxed">{book.description}</p>
              </div>
            )}
            
            {/* NOVO: DETALHES DE LIVRO FÍSICO */}
            {book.isPhysical && (
              <div className="bg-gray-800/60 p-5 rounded-xl border border-purple-700/50 shadow-md">
                <h2 className="text-xl font-bold text-purple-400 mb-3 border-b border-gray-700 pb-2 flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  Detalhes Físicos e Estoque
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-300 text-lg">
                    <span className="font-semibold text-gray-200">Cópias em Estoque:</span> {book.copyCount || 0}
                  </p>
                  <p className="text-gray-300 text-lg">
                    <span className="font-semibold text-gray-200">Localização na Prateleira:</span> {book.shelfLocation || "N/A"}
                  </p>
                </div>
              </div>
            )}
            
            {/* Detalhes técnicos */}
            <div className="grid grid-cols-2 gap-4 text-gray-300">
              {book.year && (
                <div className="bg-gray-800/40 p-3 rounded-xl border border-gray-700">
                  <p className="text-purple-400 font-medium">Ano</p>
                  <p>{book.year}</p>
                </div>
              )}

              {book.pages && (
                <div className="bg-gray-800/40 p-3 rounded-xl border border-gray-700">
                  <p className="text-purple-400 font-medium">Páginas</p>
                  <p>{book.pages}</p>
                </div>
              )}

              <div className="bg-gray-800/40 p-3 rounded-xl border border-gray-700">
                <p className="text-purple-400 font-medium">
                  Formato
                </p>
                <p>
                  {book.isPhysical ? "Físico" : "Digital"}
                </p>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition shadow-md"
              >
                Voltar
              </button>

              <button
                onClick={() => navigate(`/books/${id}/edit`)}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition shadow-md"
              >
                Editar
              </button>

              {!book.isPhysical && (
                <button
                  onClick={() => navigate(`/books/${id}/read`)}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition shadow-md"
                >
                  Ler
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;