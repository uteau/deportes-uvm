import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export default function AnuncioForm({ tipo, anuncio, onClose }) {
  const [form, setForm] = useState({ titulo: '', contenido: '', instagram_url: '', is_published: true });

  useEffect(() => {
    if (anuncio) setForm(anuncio);
  }, [anuncio]);

  const handleSubmit = async (a) => {
    a.preventDefault();
    const baseUrl = tipo === 'publico' ? '/admin/anuncios/publico' : '/admin/anuncios/seluvm';
    if (anuncio) {
      await apiClient.put(`${baseUrl}/${anuncio.id}`, form);
    } else {
      await apiClient.post(baseUrl, form);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{anuncio ? 'Editar' : 'Nuevo'} anuncio {tipo === 'publico' ? 'público' : 'seleccionado'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="titulo" placeholder="Título" value={form.titulo} onChange={a => setForm({...form, titulo: a.target.value})} className="w-full p-2 border mb-2 rounded" required />
          <textarea name="contenido" placeholder="Contenido" value={form.contenido} onChange={a => setForm({...form, contenido: a.target.value})} className="w-full p-2 border mb-2 rounded" required />
          {tipo === 'publico' && (
            <input name="instagram_url" placeholder="URL de Instagram" value={form.instagram_url} onChange={a => setForm({...form, instagram_url: a.target.value})} className="w-full p-2 border mb-2 rounded" />
          )}
          <label className="flex items-center gap-2 mb-4">
            <input type="checkbox" checked={form.is_published} onChange={a => setForm({...form, is_published: a.target.checked})} /> Publicado
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}