import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export default function PartidoForm({ partido, onClose }) {
  const [form, setForm] = useState({
    nombre: '', 
    descripcion: '', 
    fecha_partido: '', 
    lugar: '', 
    equipo_local: '', 
    equipo_visita: '', 
    resul_local: null, 
    resul_visita: null,
  });

  useEffect(() => {
    if (partido) {
      // Convertir fecha ISO a formato datetime-local para el input
      const fechaLocal = partido.fecha_partido ? partido.fecha_partido.slice(0, 16) : '';
      setForm({ ...partido, fecha_partido: fechaLocal });
    }
  }, [partido]);

  useEffect(() => {
    if (partido) setForm(partido);
  }, [partido]);

  const handleChange = (p) => {
    setForm({ ...form, [p.target.name]: p.target.value });
  };

  const handleSubmit = async (p) => {
    p.preventDefault();

    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      fecha_partido: form.fecha_partido ? new Date(form.fecha_partido).toISOString() : null,
      lugar: form.lugar,
      equipo_local: form.equipo_local,
      equipo_visita: form.equipo_visita,
      // Convertir resultados a número o null
      resul_local: form.resul_local ? parseInt(form.resul_local) : null,
      resul_visita: form.resul_visita ? parseInt(form.resul_visita) : null
    };

    try{
      if (partido) {
        await apiClient.put(`/admin/partidos/${partido.id}`, payload);
      } else {
        await apiClient.post('/admin/partidos', payload);
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
        <h2 className="text-xl font-bold mb-4">{partido ? 'Editar Partido' : 'Nuevo Partido'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="w-full p-2 border mb-2 rounded" />
          <input type="datetime-local" name="fecha_partido" value={form.fecha_partido?.slice(0,16)} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <input name="lugar" placeholder="Lugar" value={form.lugar} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <input name="equipo_local" placeholder="Equipo local" value={form.equipo_local} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <input name="equipo_visita" placeholder="Equipo visitante" value={form.equipo_visita} onChange={handleChange} className="w-full p-2 border mb-2 rounded" required />
          <input name="resul_local" placeholder="Resultado local" value={form.resul_local} onChange={handleChange} className="w-full p-2 border mb-2 rounded" />
          <input name="resul_visita" placeholder="Resultado visitante" value={form.resul_visita} onChange={handleChange} className="w-full p-2 border mb-2 rounded" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}