import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export default function DeporteForm({ deporte, onClose }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (deporte) {
      setForm({
        nombre: deporte.nombre || '',
        descripcion: deporte.descripcion || '',
      });
    }
  }, [deporte]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || undefined,
      };

      if (deporte) {
        await apiClient.put(`/admin/deportes/${deporte.id}`, payload);
      } else {
        await apiClient.post('/admin/deportes', payload);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar deporte');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {deporte ? 'Editar Deporte' : 'Nuevo Deporte'}
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre del deporte"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-uvm-primary"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción breve"
              rows="3"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-uvm-primary"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100 transition"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-uvm-primary text-white rounded hover:bg-uvm-secondary transition disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}