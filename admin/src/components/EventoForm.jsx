import { useState, useEffect, useRef } from 'react';
import apiClient from '../api/client';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/material_blue.css';
import 'flatpickr/dist/l10n/es.js';

export default function EventoForm({ evento, onClose }) {
  const [form, setForm] = useState({
    nombre: '', 
    descripcion: '', 
    fecha_evento: '', 
    lugar: ''
  });
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (evento) {
      // Para edición: convertir ISO a formato local para mostrar
      const fechaLocal = evento.fecha_evento 
        ? new Date(evento.fecha_evento).toISOString().slice(0, 16)
        : '';
      setForm({
        nombre: evento.nombre || '',
        descripcion: evento.descripcion || '',
        fecha_evento: fechaLocal,
        lugar: evento.lugar || ''
      });
    }
  }, [evento]);

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
          setForm(prev => ({ ...prev, fecha_evento: dateStr }));
        }
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear fecha en UTC para mantener la hora exacta que el usuario seleccionó
    let fechaISO = null;
    if (form.fecha_evento) {
      // flatpickr devuelve formato "2026-06-02T19:00"
      const fecha = new Date(form.fecha_evento);
      // Ajustar para que no se modifique por zona horaria
      fechaISO = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000).toISOString();
    }

    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      fecha_evento: fechaISO,
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
      alert(err.response?.data?.error?.message || 'Error al guardar');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-10 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-xl mb-4">
          {evento ? 'Editar Evento' : 'Nuevo Evento'}</h2>
        <form onSubmit={handleSubmit}>
          <input 
            name="nombre" 
            placeholder="Nombre del evento" 
            value={form.nombre} 
            onChange={handleChange} 
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            required 
          />
          <textarea 
            name="descripcion" 
            placeholder="Descripción" 
            value={form.descripcion} 
            onChange={handleChange} 
            rows="3"
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          />
          
          {/* Campo de fecha con flatpickr */}
          <input 
            ref={datePickerRef}
            type="text" 
            name="fecha_evento" 
            placeholder="Selecciona fecha y hora" 
            value={form.fecha_evento} 
            readOnly
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer" 
            required 
          />
          
          <input 
            name="lugar" 
            placeholder="Lugar" 
            value={form.lugar} 
            onChange={handleChange} 
            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            required 
          />
          
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100 transition">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-uvm-primary text-white rounded hover:bg-uvm-secondary transition">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}