import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export default function EventoForm({ evento, onClose }) {
  const [form, setForm] = useState({
    nombre: '', descripcion: '', fecha_evento: '', lugar: '', is_active: true
  });

  useEffect(() => {
    if (evento) setForm(evento);
  }, [evento]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (evento) {
      await apiClient.put(`/admin/eventos/${evento.id}`, form);
    } else {
      await apiClient.post('/admin/eventos', form);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{evento ? 'Editar Evento' : 'Nuevo Evento'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="w-full p-2 border mb-2 rounded" />
          <input type="datetime-local" name="fecha_evento" value={form.fecha_evento?.slice(0,16)} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <input name="lugar" placeholder="Lugar" value={form.lugar} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <label className="flex items-center gap-2 mb-4">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
            Activo
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