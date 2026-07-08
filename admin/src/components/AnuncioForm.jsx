import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export default function AnuncioForm({ tipo, anuncio, onClose }) {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos de edición
  useEffect(() => {
    if (anuncio) {
      setTitulo(anuncio.titulo || '');
      setContenido(anuncio.contenido || '');
      setInstagramUrl(anuncio.instagram_url || '');
    }
  }, [anuncio]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload = {
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      tipo: tipo, // usar el prop tipo (fijo)
    };

    // Solo incluir instagram_url si es público y tiene valor
    if (tipo === 'publico' && instagramUrl.trim()) {
      payload.instagram_url = instagramUrl.trim();
    }

    try {
      const baseUrl = '/admin/anuncios';
      if (anuncio) {
        await apiClient.put(`${baseUrl}/${anuncio.id}`, payload);
      } else {
        await apiClient.post(baseUrl, payload);
      }
      onClose();
    } catch (err) {
      console.error('Error al guardar:', err.response?.data || err.message);
      const mensaje =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        'Error al guardar el anuncio.';
      setError(typeof mensaje === 'string' ? mensaje : JSON.stringify(mensaje));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-xl mb-4">
          {anuncio ? 'Editar' : 'Nuevo'} anuncio {tipo === 'publico' ? 'público' : 'para seleccionados'}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            name="titulo"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2 border mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            name="contenido"
            placeholder="Contenido"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            className="w-full p-2 border mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            rows="4"
          />
          {tipo === 'publico' && (
            <input
              name="instagram_url"
              placeholder="URL de Instagram (opcional)"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="w-full p-2 border mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100 transition"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-uvm-primary text-white rounded hover:bg-uvm-secondary transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}