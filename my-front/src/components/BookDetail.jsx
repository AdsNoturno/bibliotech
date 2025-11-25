import { useParams, Link } from "react-router-dom";
import { books } from "../data/books"; // Removemos a extensão .ts da importação
// import "./BookDetail.css"; // Ajuste aqui: provavelmete você queria importar o CSS, não o .jsx

export default function BookDetail() {
  const { id } = useParams(); // Tipagem removida aqui
  const book = books.find(b => b.id === Number(id));

  if (!book) return <p className="p-8 text-purple-200">Livro não encontrado!</p>;

  return (
    <div className="min-h-screen p-8 text-white relative overflow-hidden">
      {/* Aurora roxa de fundo */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-aurora"
      />
      
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg">
        <img
          src={book.cover}
          alt={`Capa do livro ${book.title}`}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />

        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
        <h2 className="text-xl text-purple-200 mb-4">{book.author}</h2>
        <p className="mb-6">{book.description}</p>

        <a
          href={book.readLink}
          target="_blank"
          rel="noopener noreferrer" /* Boa prática de segurança para links externos */
          className="block w-full text-center bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold transition mb-4"
        >
          Ler agora
        </a>

        <Link to="/catalog" className="text-purple-300 hover:underline text-center block">
          ← Voltar ao catálogo
        </Link>
      </div>
    </div>
  );
}