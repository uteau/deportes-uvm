import { useState, useEffect, useRef } from 'react';
import apiClient from '../api/client';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/material_blue.css';
import 'flatpickr/dist/l10n/es.js';

// Función auxiliar para formatear fecha a DD-MM-YYYY HH:MM
const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export default function EventoForm({ evento, onClose }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    fecha_evento: '',
    lugar: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const datePickerRef = useRef(null);
  const flatpickrInstance = useRef(null);

  // Cargar datos si es edición
  useEffect(() => {
    if (evento) {
      const fechaLocal = evento.fecha_evento
        ? formatDateForDisplay(evento.fecha_evento)
        : '';
      setForm({
        nombre: evento.nombre || '',
        descripcion: evento.descripcion || '',
        fecha_evento: fechaLocal,
        lugar: evento.lugar || ''
      });
    }
  }, [evento]);

  // Inicializar flatpickr (solo una vez)
  useEffect(() => {
    if (datePickerRef.current && !flatpickrInstance.current) {
      flatpickrInstance.current = flatpickr(datePickerRef.current, {
        enableTime: true,
        dateFormat: "d-m-Y H:i",
        time_24hr: true,
        locale: "es",
        minuteIncrement: 1,
        defaultDate: form.fecha_evento || undefined,
        onChange: (selectedDates, dateStr) => {
          setForm(prev => ({ ...prev, fecha_evento: dateStr }));
          // Limpiar error de fecha al cambiar
          if (errors.fecha_evento) {
            setErrors(prev => ({ ...prev, fecha_evento: '' }));
          }
        }
      });
    }

    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
        flatpickrInstance.current = null;
      }
    };
  }, []); // Solo una vez

  // Sincronizar flatpickr cuando cambie la fecha desde el estado (ej. al editar)
  useEffect(() => {
    if (flatpickrInstance.current && form.fecha_evento) {
      flatpickrInstance.current.setDate(form.fecha_evento, false);
    }
  }, [form.fecha_evento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!form.fecha_evento) newErrors.fecha_evento = 'La fecha es obligatoria';
    if (!form.lugar.trim()) newErrors.lugar = 'El lugar es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let fechaISO = null;
      if (form.fecha_evento) {
        // Parsear "DD-MM-YYYY HH:MM" a objeto Date
        const [datePart, timePart] = form.fecha_evento.split(' ');
        const [day, month, year] = datePart.split('-').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);
        const fecha = new Date(year, month - 1, day, hours, minutes);
        // Ajuste de zona horaria para mantener la hora exacta seleccionada
        fechaISO = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000).toISOString();
      }

      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || undefined,
        fecha_evento: fechaISO,
        lugar: form.lugar.trim()
      };

      if (evento) {
        await apiClient.put(`/admin/eventos/${evento.id}`, payload);
      } else {
        await apiClient.post('/admin/eventos', payload);
      }
      onClose();
    } catch (err) {
      console.error('Error al guardar:', err.response?.data);
      alert(err.response?.data?.error?.message || 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl mb-4">
          {evento ? 'Editar Evento' : 'Nuevo Evento'}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Nombre */}
          <div className="mb-2">
            <input
              name="nombre"
              placeholder="Nombre del evento"
              value={form.nombre}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.nombre ? 'border-red-500' : ''}`}
              required
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>

          {/* Descripción */}
          <textarea
            name="descripcion"
            placeholder="Descripción (opcional)"
            value={form.descripcion}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Fecha */}
          <div className="mb-2">
            <input
              ref={datePickerRef}
              type="text"
              name="fecha_evento"
              placeholder="Selecciona fecha y hora"
              value={form.fecha_evento}
              readOnly
              className={`w-full p-2 border rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.fecha_evento ? 'border-red-500' : ''}`}
              required
            />
            {errors.fecha_evento && <p className="text-red-500 text-xs mt-1">{errors.fecha_evento}</p>}
          </div>

          {/* Lugar */}
          <div className="mb-4">
            <input
              name="lugar"
              placeholder="Lugar"
              value={form.lugar}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.lugar ? 'border-red-500' : ''}`}
              required
            />
            {errors.lugar && <p className="text-red-500 text-xs mt-1">{errors.lugar}</p>}
          </div>

          {/* Botones */}
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