import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../service/api';

export default function CreateBook() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    isPhysical: false,
    fullText: '',
    copyCount: 1,
    shelfLocation: '',
  });
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setCoverFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('author', formData.author);
      data.append('description', formData.description);
      data.append('isPhysical', formData.isPhysical ? 'true' : 'false');

      if (formData.isPhysical) {
        data.append('copyCount', String(formData.copyCount));
        data.append('shelfLocation', formData.shelfLocation);
      } else {
        data.append('fullText', formData.fullText);
      }

      if (coverFile) data.append('coverImage', coverFile);

      await api.post('/books', data, { headers: { 'Content-Type': 'multipart/form-data' } });

      setSuccess(true);
      setTimeout(() => navigate('/catalog'), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erro ao criar livro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-6 relative">

      {/* 🔙 BOTÃO DE VOLTAR */}
      <Link
        to="/catalog"
        className="absolute top-6 left-6 px-4 py-2 bg-gray-800/80 hover:bg-gray-700 
                   text-purple-300 font-medium rounded-lg shadow-md transition flex items-center gap-1"
      >
        ← Voltar
      </Link>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-gray-900 text-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h1 className="text-3xl font-bold text-purple-400 text-center">Adicionar Novo Livro</h1>

        {success && (
          <div className="p-3 bg-green-900/50 text-green-400 rounded text-center">
            Livro criado com sucesso! Redirecionando...
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-900/50 text-red-400 rounded text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Título"
            required
            disabled={loading}
            className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />

          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Autor"
            required
            disabled={loading}
            className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descrição"
            rows="3"
            disabled={loading}
            className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPhysical"
            checked={formData.isPhysical}
            onChange={handleChange}
            disabled={loading}
            className="h-5 w-5 text-purple-600"
          />
          <label>Livro Físico</label>
        </div>

        {formData.isPhysical ? (
          <div className="p-4 border border-green-500 rounded-xl space-y-4 bg-gray-800">
            <input
              type="number"
              name="copyCount"
              value={formData.copyCount}
              min="0"
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Cópias"
              className="w-full p-3 rounded-xl border border-gray-700 bg-gray-900"
            />
            <input
              type="text"
              name="shelfLocation"
              value={formData.shelfLocation}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Localização"
              className="w-full p-3 rounded-xl border border-gray-700 bg-gray-900"
            />
          </div>
        ) : (
          <div className="p-4 border border-purple-500 rounded-xl space-y-4 bg-gray-800">
            <textarea
              name="fullText"
              value={formData.fullText}
              onChange={handleChange}
              required
              disabled={loading}
              rows="6"
              placeholder="Texto do Livro Digital"
              className="w-full p-3 rounded-xl border border-gray-700 bg-gray-900"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold text-white transition disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Criar Livro'}
        </button>
      </form>
    </div>
  );
}
