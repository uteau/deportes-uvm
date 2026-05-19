import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export default function EventoForm({ evento, onClose }) {
  
  const [form, setForm] = useState({
    nombre: '', 
    descripcion: '', 
    fecha_evento: '', 
    lugar: ''
  });

  useEffect(() => {
    if (evento) setForm(evento);
  }, [evento]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      fecha_evento: form.fecha_evento,
      lugar: form.lugar
    };

    try {
      if (evento) {
        await apiClient.put(`/admin/eventos/${evento.id}`, payload);
      } else {
        await apiClient.post('/admin/eventos', payload);
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
        <h2 className="text-xl font-bold mb-4">{evento ? 'Editar Evento' : 'Nuevo Evento'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="w-full p-2 border mb-2 rounded" />
          <input type="datetime-local" name="fecha_evento" value={form.fecha_evento?.slice(0,16)} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <input name="lugar" placeholder="Lugar" value={form.lugar} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}