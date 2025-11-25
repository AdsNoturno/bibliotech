import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../service/auth';
import { getCurrentUserId } from '../service/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login({ email, password });
      localStorage.setItem("token", data.token);
      navigate('/catalog', { replace: true });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Credenciais inválidas. Tente novamente.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const particles = Array.from({ length: 30 }).map((_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 6 + 3}px`,
    color: `rgba(138, 43, 226, ${Math.random() * 0.4 + 0.2})`,
    delay: `${Math.random() * 6}s`,
    duration: `${Math.random() * 6 + 6}s`,
  }));

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden p-4">

      {/* Botão voltar Home destacado */}
      <Link
        to="/"
        className="absolute top-4 left-4 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-medium rounded-lg shadow-lg transition flex items-center gap-1"
      >
        ← Voltar
      </Link>

      {/* Fundo animado exclusivo Login */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[150%] h-[150%] -top-1/3 -left-1/4 bg-gradient-to-tr from-purple-700 via-indigo-700 to-blue-500 opacity-20 blur-[140px] rounded-full wave-login" />
        <div className="absolute w-[120%] h-[120%] bottom-[-20%] left-[-10%] bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 opacity-15 blur-[120px] rounded-full wave-login delay-2s" />
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
              animation: `particleFloatLogin ${p.duration} ease-in-out ${p.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Card de Login */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white/20">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-300 drop-shadow-lg">Entrar</h1>

        {error && (
          <div className="p-3 mb-4 bg-red-600 rounded text-center font-medium">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-300">
          Ainda não tem conta?{' '}
          <a href="/register" className="text-purple-300 font-medium hover:underline">
            Cadastre-se
          </a>
        </p>
      </div>

      {/* Keyframes e animações */}
      <style>{`
        @keyframes particleFloatLogin {
          0% { transform: translate(0,0); opacity: 0; }
          25% { transform: translate(15px,-20px); opacity: 0.5; }
          50% { transform: translate(-15px,-40px); opacity: 0.8; }
          75% { transform: translate(20px,-60px); opacity: 0.5; }
          100% { transform: translate(0,-80px); opacity: 0; }
        }

        @keyframes waveLogin {
          0% { transform: translateX(0) translateY(0) scale(0.95); opacity: 0.1; }
          50% { transform: translateX(50px) translateY(-20px) scale(1.05); opacity: 0.3; }
          100% { transform: translateX(0) translateY(0) scale(0.95); opacity: 0.1; }
        }

        .wave-login { animation: waveLogin 10s ease-in-out infinite alternate; }
        .wave-login.delay-2s { animation-delay: 2s; }
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
