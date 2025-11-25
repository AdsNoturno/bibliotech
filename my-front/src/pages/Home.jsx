import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png"; 

// 1. IMPORTAÇÃO DAS IMAGENS DO CARROSSEL
import capa1 from "../assets/covers/capa1.jpeg";
import capa2 from "../assets/covers/capa2.jpeg";
import capa3 from "../assets/covers/capa3.jpeg";
import capa4 from "../assets/covers/capa4.jpeg";
import capa5 from "../assets/covers/capa5.jpeg";

// 2. CRIAÇÃO DO ARRAY DE COVERS
const carouselCovers = [
  capa1, // Verifique se estas variáveis (capa1, capa2, etc.) são as corretas
  capa2,
  capa3,
  capa4,
  capa5,
  capa1, 
  capa3,
  capa5,
  capa2,
];
// ... restante do código

export default function Home() {
  const [showAbout, setShowAbout] = useState(false);

  // ... (código das partículas e animações) ...

  const particles = Array.from({ length: 60 }).map((_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 6 + 4}px`,
    color: `rgba(${Math.floor(Math.random()*255)}, ${
      Math.floor(Math.random()*255)
    }, 255, ${Math.random()*0.5+0.3})`,
    delay: `${Math.random() * 6}s`,
    duration: `${Math.random()*6 + 4}s`,
  }));

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-950 text-white">

      {/* ----------------------------------------------------- */}
      {/* FUNDO ANIMADO + PARTÍCULAS */}
      {/* ----------------------------------------------------- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-64 -left-64 w-[500px] h-[500px] bg-purple-600 opacity-15 blur-3xl rounded-full pulse-aurora" />
        <div className="absolute -bottom-64 -right-64 w-[500px] h-[500px] bg-blue-600 opacity-15 blur-3xl rounded-full pulse-aurora" />
        <div className="absolute -bottom-32 left-20 w-[400px] h-[400px] bg-pink-500 opacity-10 blur-3xl rounded-full pulse-aurora" />
        <div className="absolute top-32 -right-32 w-[400px] h-[400px] bg-cyan-400 opacity-10 blur-2xl rounded-full pulse-aurora" />

        {particles.map((p, i) => (
          <div
            key={i}
            className="particle rounded-full blur-sm"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              animation: `particleFloat ${p.duration} linear ${p.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* ----------------------------------------------------- */}
      {/* NAVBAR FIXA */}
      {/* ----------------------------------------------------- */}
      <div className="w-full flex items-center justify-between px-10 py-2 bg-gray-900/25 backdrop-blur-lg fixed top-0 z-20">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img 
            src={logo}
            alt="Logo Bibliotech"
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className="text-2xl font-bold text-purple-300 tracking-tight">
            Bibliotech
          </span>
        </div>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 transition"
          >
            Cadastro
          </Link>
        </div>
      </div>


      {/* ----------------------------------------------------- */}
      {/* TÍTULO E BOTÕES */}
      {/* ----------------------------------------------------- */}
      <div className="relative z-10 text-center px-6 mt-28">
        <h1 className="text-6xl md:text-7xl font-extrabold text-purple-300 drop-shadow-xl mb-4 tracking-tight">
          Bem-vindo à <span className="text-purple-400">Bibliotech</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10">
          A plataforma onde tecnologia e conhecimento se encontram. Explore livros,
          ferramentas, artigos e muito mais.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link 
              to="/login" 
            className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition-all text-white font-semibold shadow-lg"
          >
            Explorar Biblioteca
          </Link>

          <button
            onClick={() => setShowAbout(true)}
            className="px-8 py-3 rounded-xl bg-transparent border border-purple-500 text-purple-300 hover:bg-purple-900/20 transition-all font-semibold shadow-lg"
          >
            Saiba Mais
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------- */}
      {/* MODAL “SOBRE” */}
      {/* ----------------------------------------------------- */}
      {showAbout && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900/90 p-8 rounded-3xl max-w-2xl text-center text-white shadow-2xl animate-fadeIn">
            <h2 className="text-4xl font-bold mb-4 text-purple-300">Por que criamos o Bibliotech</h2>
            <p className="text-lg text-gray-300 mb-6">
              O Bibliotech nasceu da necessidade de centralizar e organizar recursos de tecnologia e conhecimento em um só lugar.
            </p>
            <p className="text-lg text-gray-300 mb-6">
              A ideia é criar uma experiência agradável, intuitiva e moderna, permitindo que cada visitante encontre exatamente o que precisa sem esforço.
            </p>
            <button
              onClick={() => setShowAbout(false)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition"
            >
              Fechar
            </button>
            
          </div>
        </div>
      )}

      {/* ----------------------------------------------------- */}
      {/* CARROSSEL ESTILO NETFLIX (COM AS IMAGENS IMPORTADAS) */}
      {/* ----------------------------------------------------- */}
      <div className="relative w-full mt-32 pb-20 z-10 flex flex-col items-center">

        {/* FADES LATERAIS */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-48 bg-gradient-to-r from-gray-950 to-transparent z-30"></div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-48 bg-gradient-to-l from-gray-950 to-transparent z-30"></div>

        <h2 className="text-3xl font-bold mb-4 text-purple-300 px-10">
          Sugestões de Livros
        </h2>

        <div className="relative w-full max-w-6xl">

          {/* SETA ESQUERDA */}
          <button
            onClick={() => document.getElementById("carouselRow").scrollBy({ left: -300, behavior: "smooth" })}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-gray-900/60 hover:bg-gray-800 text-white px-3 py-4 rounded-r-xl backdrop-blur-md shadow-lg"
          >
            ❮
          </button>

          {/* SETA DIREITA */}
          <button
            onClick={() => document.getElementById("carouselRow").scrollBy({ left: 300, behavior: "smooth" })}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-gray-900/60 hover:bg-gray-800 text-white px-3 py-4 rounded-l-xl backdrop-blur-md shadow-lg"
          >
            ❯
          </button>

          {/* LISTA DE CARDS */}
          <div
            id="carouselRow"
            className="flex gap-8 px-20 py-4 overflow-x-scroll scroll-smooth scrollbar-hide"
          >
            {carouselCovers.map((src, i) => ( // USANDO O ARRAY DE COVERS AQUI!
              <div
                key={i}
                className="
                  min-w-[150px] h-[220px] rounded-xl border border-purple-700 
                  shadow-lg overflow-hidden transition-all duration-300
                  hover:scale-[1.10] hover:z-20 hover:shadow-purple-600/40
                  opacity-70 hover:opacity-100
                "
              >
                <img
                  src={src}
                  alt={`Livro Sugerido ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ----------------------------------------------------- */}
      {/* ANIMAÇÕES ✨ */}
      {/* ----------------------------------------------------- */}
      <style>{`
        @keyframes particleFloat {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-120px) translateX(60px); opacity: 0; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .pulse-aurora {
          animation: pulseAurora 6s ease-in-out infinite alternate;
        }
        @keyframes pulseAurora {
          0% { transform: scale(0.95); opacity: 0.15; }
          50% { transform: scale(1.05); opacity: 0.25; }
          100% { transform: scale(0.95); opacity: 0.15; }
        }
      `}</style>

    </div>
    
  );
}