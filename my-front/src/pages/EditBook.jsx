import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/api';
import { getCurrentUserId } from '../service/auth';

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverImage, setCoverImage] = useState('');
  const [isVirtual, setIsVirtual] = useState(false);
  const [fullText, setFullText] = useState('');
  const [copyCount, setCopyCount] = useState(0);
  const [shelfLocation, setShelfLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      const currentUserId = getCurrentUserId();
      if (!currentUserId) {
        navigate('/login');
        return;
      }
      try {
        const res = await api.get(`/books/${id}`);
        const b = res.data;
        if (b.user !== currentUserId) {
          setError('Acesso negado. Redirecionando...');
          setTimeout(() => navigate('/catalog'), 2000);
          return;
        }
        setBook(b);
        setTitle(b.title);
        setAuthor(b.author);
        setDescription(b.description || '');
        setCoverImage(b.coverImage || '');
        setIsVirtual(!b.isPhysical);
        setFullText(b.fullText || '');
        setCopyCount(b.copyCount || 0);
        setShelfLocation(b.shelfLocation || '');
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar livro.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setCoverFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const data = new FormData();
      data.append('title', title);
      data.append('author', author);
      data.append('description', description);
      data.append('isPhysical', (!isVirtual).toString());

      if (isVirtual) {
        data.append('fullText', fullText);
        data.append('copyCount', '0');
        data.append('shelfLocation', '');
      } else {
        data.append('copyCount', String(copyCount));
        data.append('shelfLocation', shelfLocation);
        data.append('fullText', '');
      }

      if (coverFile) data.append('coverImage', coverFile);

      await api.put(`/books/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });

      setSaveSuccess(true);
      setTimeout(() => navigate('/catalog'), 1500);

    } catch (err) {
      console.error(err);
      setError('Erro ao atualizar o livro.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/books/${id}`);
      navigate('/catalog', { state: { message: 'Livro deletado com sucesso!' } });
    } catch (err) {
      console.error(err);
      setError('Erro ao deletar o livro.');
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-purple-400">Carregando livro...</div>;
  if (error && !book) return <div className="max-w-md mx-auto p-6 mt-10 text-center text-red-400 bg-red-900/50 rounded-xl">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gray-900 text-white rounded-2xl shadow-2xl p-8 space-y-6">
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md border-t-4 border-red-500 shadow-2xl">
              <h3 className="text-2xl font-bold text-red-400 mb-4">Confirmar Exclusão</h3>
              <p className="text-gray-300 mb-6">Tem certeza que deseja deletar <span className="font-semibold text-white">{book?.title}</span>? Esta ação não pode ser desfeita.</p>
              <div className="flex justify-end gap-4">
                <button onClick={() => setShowDeleteModal(false)} className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition">Cancelar</button>
                <button onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md shadow-red-500/50">Sim, Deletar</button>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-extrabold text-purple-400 text-center drop-shadow-lg">Editar Livro: {book?.title}</h1>

        {saveSuccess && <div className="p-3 bg-green-900/50 text-green-400 rounded-lg border border-green-600 text-center">Livro atualizado! Redirecionando...</div>}
        {error && <div className="p-3 bg-red-900/50 text-red-400 rounded-lg border border-red-600 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" required disabled={loading}
            className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 focus:ring-2 focus:ring-purple-600 focus:outline-none" />
          <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Autor" required disabled={loading}
            className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 focus:ring-2 focus:ring-purple-600 focus:outline-none" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" placeholder="Descrição" disabled={loading}
            className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 focus:ring-2 focus:ring-purple-600 focus:outline-none" />
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading}
            className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600" />

          <div className="flex items-center gap-2">
            <input type="checkbox" checked={!isVirtual} onChange={e => setIsVirtual(!e.target.checked)} disabled={loading} className="h-5 w-5 text-purple-600" />
            <label>É um Livro Físico</label>
          </div>

          {isVirtual ? (
            <textarea rows="6" value={fullText} onChange={e => setFullText(e.target.value)} placeholder="Texto do Livro Digital" disabled={loading}
              className="w-full p-3 rounded-xl border border-gray-700 bg-gray-900 focus:ring-2 focus:ring-purple-600 focus:outline-none" />
          ) : (
            <>
              <input type="number" value={copyCount} min="0" onChange={e => setCopyCount(parseInt(e.target.value) || 0)} required disabled={loading}
                className="w-full p-3 rounded-xl border border-gray-700 bg-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none" />
              <input type="text" value={shelfLocation} onChange={e => setShelfLocation(e.target.value)} required disabled={loading}
                className="w-full p-3 rounded-xl border border-gray-700 bg-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold text-white transition disabled:opacity-50 shadow-lg">
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button type="button" onClick={() => setShowDeleteModal(true)} disabled={loading} className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-white transition disabled:opacity-50 shadow-lg">
              Deletar Livro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
