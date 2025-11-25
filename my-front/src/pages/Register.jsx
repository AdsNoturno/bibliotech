import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../service/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({ name, email, password });
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Erro ao cadastrar. Verifique a conexão com a API.";
      setError(errorMessage);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const particles = Array.from({ length: 70 }).map((_, idx) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 2}px`,
    color: `rgba(138, 43, 226, ${0.1 + Math.random() * 0.3})`,
    duration: `${5 + Math.random() * 7}s`,
  }));

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-950 to-purple-900 p-4">

      {/* Botão Voltar destacado */}
      <Link
        to="/"
        className="absolute top-4 left-4 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-medium rounded-lg shadow-lg transition flex items-center gap-1 z-20"
      >
        ← Voltar
      </Link>

      {/* Luzes de gradiente animadas */}
      <div className="absolute -top-1/4 -left-1/4 w-[400px] h-[400px] rounded-full bg-pink-500 opacity-20 blur-3xl animate-pulseWave"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-400 opacity-25 blur-3xl animate-pulseWave delay-1500"></div>
      <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-purple-600 opacity-15 blur-2xl animate-pulseWave delay-3000"></div>

      {/* Partículas neon */}
      {particles.map((p, idx) => (
        <div
          key={idx}
          className="absolute rounded-full blur-sm"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            backgroundColor: p.color,
            animation: `floatingWave ${p.duration} ease-in-out infinite`,
          }}
        />
      ))}

      {/* Card de Cadastro */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/20">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-300 drop-shadow-lg">Criar Conta</h1>

        {success && (
          <div className="p-3 mb-4 bg-green-600 rounded text-center font-medium">
            Cadastro realizado com sucesso! Redirecionando...
          </div>
        )}

        {error && (
          <div className="p-3 mb-4 bg-red-600 rounded text-center font-medium">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-purple-400 focus:border-purple-400 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-purple-400 focus:border-purple-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-purple-400 focus:border-purple-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg mt-2 transition disabled:opacity-50 font-semibold shadow-lg hover:shadow-purple-400/50 glow-button-login"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-300">
          Já tem conta? <a href="/login" className="text-purple-300 hover:underline">Entrar</a>
        </p>
      </div>

      {/* Animações CSS */}
      <style>{`
        @keyframes floatingWave {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          25% { transform: translate(-8px, 4px) rotate(5deg); }
          50% { transform: translate(8px, -6px) rotate(-5deg); }
          75% { transform: translate(-5px, 3px) rotate(3deg); }
        }
        .animate-floatingWave { animation: floatingWave 9s ease-in-out infinite; }

        @keyframes pulseWave {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.4); opacity: 0.35; }
        }
        .animate-pulseWave { animation: pulseWave 7s ease-in-out infinite; }
        .delay-1500 { animation-delay: 1.5s; }
        .delay-3000 { animation-delay: 3s; }

        .glow-button-login { animation: glowButtonLogin 3s ease-in-out infinite; }
        @keyframes glowButtonLogin {
          0% { box-shadow: 0 0 10px rgba(168,85,247,0.4); }
          50% { box-shadow: 0 0 25px rgba(168,85,247,0.7); }
          100% { box-shadow: 0 0 10px rgba(168,85,247,0.4); }
        }
      `}</style>
    </div>
  );
}
