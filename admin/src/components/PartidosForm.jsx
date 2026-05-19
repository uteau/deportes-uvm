import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export default function PartidoForm({ partido, onClose }) {
  const [form, setForm] = useState({
    nombre: '', 
    descripcion: '', 
    fecha_evento: '', 
    lugar: '', 
    equipo_local: '', 
    equipo_visitante: '', 
    resultado_local: '', 
    resultado_visitante: ''
  });

  useEffect(() => {
    if (partido) setForm(partido);
  }, [partido]);

  const handleChange = (p) => {
    setForm({ ...form, [p.target.name]: p.target.value });
  };

  const handleSubmit = async (p) => {
    p.preventDefault();
    if (partido) {
      await apiClient.put(`/admin/partidos/${partido.id}`, form);
    } else {
      await apiClient.post('/admin/partidos', form);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{partido ? 'Editar Partido' : 'Nuevo Partido'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="w-full p-2 border mb-2 rounded" />
          <input type="datetime-local" name="fecha_evento" value={form.fecha_evento?.slice(0,16)} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <input name="lugar" placeholder="Lugar" value={form.lugar} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <input name="equipo_local" placeholder="Equipo local" value={form.equipo_local} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <input name="equipo_visitante" placeholder="Equipo visitante" value={form.equipo_visitante} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <input name="resultado_local" placeholder="Resultado local" value={form.resultado_local} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <input name="resultado_visitante" placeholder="Resultado visitante" value={form.resultado_visitante} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}