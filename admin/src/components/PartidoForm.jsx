import { useState, useEffect, useRef } from 'react';
import apiClient from '../api/client';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/material_blue.css';
import 'flatpickr/dist/l10n/es.js';

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
  const datePickerRef = useRef(null);

  // Cargar datos si es edición
  useEffect(() => {
    if (partido) {
      const fechaLocal = partido.fecha_partido 
        ? new Date(partido.fecha_partido).toISOString().slice(0, 16)
        : '';
      setForm({
        nombre: partido.nombre || '',
        descripcion: partido.descripcion || '',
        fecha_partido: fechaLocal,
        lugar: partido.lugar || '',
        equipo_local: partido.equipo_local || '',
        equipo_visita: partido.equipo_visita || '',
        resul_local: partido.resul_local || null,
        resul_visita: partido.resul_visita || null,
      });
    }
  }, [partido]);

  // Inicializar flatpickr
  useEffect(() => {
    if (datePickerRef.current) {
      flatpickr(datePickerRef.current, {
        enableTime: true,
        dateFormat: "Y-m-d\\TH:i",
        time_24hr: true,  // Formato 24 horas
        locale: "es",
        minuteIncrement: 1,
        onChange: (selectedDates, dateStr) => {
          setForm(prev => ({ ...prev, fecha_partido: dateStr }));
        }
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convertir fecha a ISO manteniendo la hora exacta
    let fechaISO = null;
    if (form.fecha_partido) {
      const fecha = new Date(form.fecha_partido);
      fechaISO = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000).toISOString();
    }

    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      fecha_partido: fechaISO,
      lugar: form.lugar,
      equipo_local: form.equipo_local,
      equipo_visita: form.equipo_visita,
      resul_local: form.resul_local ? parseInt(form.resul_local) : null,
      resul_visita: form.resul_visita ? parseInt(form.resul_visita) : null
    };

    try {
      if (partido) {
        await apiClient.put(`/admin/partidos/${partido.id}`, payload);
      } else {
        await apiClient.post('/admin/partidos', payload);
      }
      onClose();
    } catch (err) {
      console.error('Error al guardar:', err.response?.data);
      alert(err.response?.data?.error?.message || 'Error al guardar');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{partido ? 'Editar Partido' : 'Nuevo Partido'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <input 
            name="nombre" 
            placeholder="Nombre del partido" 
            value={form.nombre} 
            onChange={handleChange} 
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            required 
          />

          {/* Descripción */}
          <textarea 
            name="descripcion" 
            placeholder="Descripción" 
            value={form.descripcion} 
            onChange={handleChange} 
            rows="3"
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          />

          {/* Fecha y hora con flatpickr */}
          <input 
            ref={datePickerRef}
            type="text" 
            name="fecha_partido" 
            placeholder="Selecciona fecha y hora" 
            value={form.fecha_partido} 
            readOnly
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer" 
            required 
          />

          {/* Lugar */}
          <input 
            name="lugar" 
            placeholder="Lugar" 
            value={form.lugar} 
            onChange={handleChange} 
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            required 
          />

          {/* Equipos */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input 
              name="equipo_local" 
              placeholder="Equipo local" 
              value={form.equipo_local} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
              required 
            />
            <input 
              name="equipo_visita" 
              placeholder="Equipo visitante" 
              value={form.equipo_visita} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
              required 
            />
          </div>

          {/* Resultados */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <input 
              type="number" 
              name="resul_local" 
              placeholder="Resultado local" 
              value={form.resul_local ?? ''} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
            <input 
              type="number" 
              name="resul_visita" 
              placeholder="Resultado visitante" 
              value={form.resul_visita ?? ''} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border rounded hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}