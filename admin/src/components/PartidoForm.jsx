import { useState, useEffect, useRef } from 'react';
import apiClient from '../api/client';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/material_blue.css';
import 'flatpickr/dist/l10n/es.js';

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

export default function PartidoForm({ partido, onClose }) {
  const [deportes, setDeportes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    fecha_partido: '',
    lugar: '',
    deporte_id: '',
    equipo_local: '',
    equipo_visita: '',
    resul_local: '',
    resul_visita: '',
  });

  const datePickerRef = useRef(null);
  const flatpickrInstance = useRef(null);

  // Cargar deportes
  useEffect(() => {
    apiClient.get('/admin/deportes')
      .then(res => {
        const sorted = res.data.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setDeportes(sorted);
      })
      .catch(console.error);
  }, []);

  // Cargar datos si es edición
  useEffect(() => {
    apiClient.get('/admin/deportes')
      .then(res => {
        const sorted = res.data.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setDeportes(sorted);
      })
      .catch(console.error);

    if (partido) {
      const fechaLocal = partido.fecha_partido
        ? formatDateForDisplay(partido.fecha_partido)
        : '';
        
      setForm({
        nombre: partido.nombre || '',
        descripcion: partido.descripcion || '',
        fecha_partido: fechaLocal,
        lugar: partido.lugar || '',
        deporte_id: partido.deporte?.id || '',
        equipo_local: partido.equipo_local || '',
        equipo_visita: partido.equipo_visita || '',
        resul_local: partido.resul_local ?? '',
        resul_visita: partido.resul_visita ?? '',
      });
    }
  }, [partido]);

  // Inicializar flatpickr
  useEffect(() => {
    if (datePickerRef.current && !flatpickrInstance.current) {
      flatpickrInstance.current = flatpickr(datePickerRef.current, {
        enableTime: true,
        dateFormat: "d-m-Y H:i",
        time_24hr: true,
        locale: "es",
        minuteIncrement: 1,
        defaultDate: form.fecha_partido || undefined,
        onChange: (selectedDates, dateStr) => {
          setForm(prev => ({ ...prev, fecha_partido: dateStr }));
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

  // Sincronizar flatpickr cuando cambie la fecha desde el estado (por ejemplo, al editar)
  useEffect(() => {
    if (flatpickrInstance.current && form.fecha_partido) {
      flatpickrInstance.current.setDate(form.fecha_partido, false);
    }
  }, [form.fecha_partido]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!form.fecha_partido) newErrors.fecha_partido = 'La fecha es obligatoria';
    if (!form.lugar.trim()) newErrors.lugar = 'El lugar es obligatorio';
    if (!form.deporte_id) newErrors.deporte_id = 'Selecciona un deporte';
    if (!form.equipo_local.trim()) newErrors.equipo_local = 'Equipo local requerido';
    if (!form.equipo_visita.trim()) newErrors.equipo_visita = 'Equipo visitante requerido';
    // Validar resultados (opcionales pero deben ser números positivos si existen)
    if (form.resul_local && (isNaN(form.resul_local) || parseInt(form.resul_local) < 0)) {
      newErrors.resul_local = 'Debe ser un número positivo';
    }
    if (form.resul_visita && (isNaN(form.resul_visita) || parseInt(form.resul_visita) < 0)) {
      newErrors.resul_visita = 'Debe ser un número positivo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let fechaISO = null;
      if (form.fecha_partido) {
        // Parsear "DD-MM-YYYY HH:MM" a objeto Date
        const [datePart, timePart] = form.fecha_partido.split(' ');
        const [day, month, year] = datePart.split('-').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);
        const fecha = new Date(year, month - 1, day, hours, minutes);
        // Ajuste de zona horaria (si lo usabas)
        fechaISO = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000).toISOString();
      }
      // Enviar fecha en UTC sin ajustes manuales (el backend debe interpretar como UTC o usar zona)
      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        fecha_partido: fechaISO,
        lugar: form.lugar.trim(),
        deporte_id: form.deporte_id,
        equipo_local: form.equipo_local.trim(),
        equipo_visita: form.equipo_visita.trim(),
        resul_local: form.resul_local !== '' ? parseInt(form.resul_local, 10) : null,
        resul_visita: form.resul_visita !== '' ? parseInt(form.resul_visita, 10) : null,
      };

      if (partido) {
        await apiClient.put(`/admin/partidos/${partido.id}`, payload);
      } else {
        await apiClient.post('/admin/partidos', payload);
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
          {partido ? 'Editar Partido' : 'Nuevo Partido'}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Nombre */}
          <div className="mb-2">
            <input
              name="nombre"
              placeholder="Nombre del partido"
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
              name="fecha_partido"
              placeholder="Selecciona fecha y hora"
              value={form.fecha_partido}
              readOnly
              className={`w-full p-2 border rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.fecha_partido ? 'border-red-500' : ''}`}
              required
            />
            {errors.fecha_partido && <p className="text-red-500 text-xs mt-1">{errors.fecha_partido}</p>}
          </div>

          {/* Lugar */}
          <div className="mb-2">
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

          {/* Deporte */}
          <div className="mb-2">
            <select
              name="deporte_id"
              value={form.deporte_id}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.deporte_id ? 'border-red-500' : ''}`}
              required
            >
              <option value="">Seleccionar deporte</option>
              {deportes.map(d => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
            {errors.deporte_id && <p className="text-red-500 text-xs mt-1">{errors.deporte_id}</p>}
          </div>

          {/* Equipos */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <input
                name="equipo_local"
                placeholder="Equipo local"
                value={form.equipo_local}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.equipo_local ? 'border-red-500' : ''}`}
                required
              />
              {errors.equipo_local && <p className="text-red-500 text-xs mt-1">{errors.equipo_local}</p>}
            </div>
            <div>
              <input
                name="equipo_visita"
                placeholder="Equipo visitante"
                value={form.equipo_visita}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.equipo_visita ? 'border-red-500' : ''}`}
                required
              />
              {errors.equipo_visita && <p className="text-red-500 text-xs mt-1">{errors.equipo_visita}</p>}
            </div>
          </div>

          {/* Resultados */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <input
                type="number"
                name="resul_local"
                placeholder="Resultado local"
                value={form.resul_local}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.resul_local ? 'border-red-500' : ''}`}
                min="0"
                step="1"
              />
              {errors.resul_local && <p className="text-red-500 text-xs mt-1">{errors.resul_local}</p>}
            </div>
            <div>
              <input
                type="number"
                name="resul_visita"
                placeholder="Resultado visitante"
                value={form.resul_visita}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.resul_visita ? 'border-red-500' : ''}`}
                min="0"
                step="1"
              />
              {errors.resul_visita && <p className="text-red-500 text-xs mt-1">{errors.resul_visita}</p>}
            </div>
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