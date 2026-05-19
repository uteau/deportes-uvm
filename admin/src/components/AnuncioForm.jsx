import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export default function AnuncioForm({ tipo, anuncio, onClose }) {
  
  const [form, setForm] = useState({ 
    titulo: '', 
    contenido: '', 
    subtipo: tipo, 
    instagram_url: ''
  });

  useEffect(() => {
    if (anuncio) setForm(anuncio);
  }, [anuncio]);

  const handleSubmit = async (a) => {
    a.preventDefault();

    // Construir el payload sin enviar instagram_url si es seluvm
    const payload = {
      titulo: form.titulo,
      contenido: form.contenido,
      subtipo: form.subtipo
    };

    if (tipo === 'publico' && form.instagram_url) {
      payload.instagram_url = form.instagram_url;
    }

    const baseUrl = '/admin/anuncios';
    try {
      if (anuncio) {
        await apiClient.put(`${baseUrl}/${anuncio.id}`, payload);
      } else {
        await apiClient.post(baseUrl, payload);
      }
      onClose();
    } catch (err) {
      console.error('Error al guardar:', err.response?.data);
      alert(err.response?.data?.message?.join('\n') || 'Error al guardar');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {anuncio ? 'Editar' : 'Nuevo'} anuncio {tipo === 'publico' ? 'público' : 'para seleccionados'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input 
            name="titulo" 
            placeholder="Título" 
            value={form.titulo} 
            onChange={(e) => setForm({...form, titulo: e.target.value})} 
            className="w-full p-2 border mb-2 rounded" 
            required 
          />
          
          <textarea 
            name="contenido" 
            placeholder="Contenido" 
            value={form.contenido} 
            onChange={(e) => setForm({...form, contenido: e.target.value})} 
            className="w-full p-2 border mb-2 rounded" 
            required 
            rows="4"
          />
          
          {tipo === 'publico' && (
            <input 
              name="instagram_url" 
              placeholder="URL de Instagram (opcional)" 
              value={form.instagram_url} 
              onChange={(e) => setForm({...form, instagram_url: e.target.value})} 
              className="w-full p-2 border mb-4 rounded" 
            />
          )}
          
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}