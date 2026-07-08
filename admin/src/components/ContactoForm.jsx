import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export default function ContactoForm({ contacto, onClose }) {
  const [form, setForm] = useState({
    nombre: '',
    rol: '',
    email: '',
    telefono: '',
    descripcion_servicio: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (contacto) {
      setForm({
        nombre: contacto.nombre || '',
        rol: contacto.rol || '',
        email: contacto.email || '',
        telefono: contacto.telefono || '',
        descripcion_servicio: contacto.descripcion_servicio || '',
      });
    }
  }, [contacto]);

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
        rol: form.rol.trim() || undefined,
        email: form.email.trim() || undefined,
        telefono: form.telefono.trim() || undefined,
        descripcion_servicio: form.descripcion_servicio.trim() || undefined,
      };

      if (contacto) {
        await apiClient.put(`/admin/contactos/${contacto.id}`, payload);
      } else {
        await apiClient.post('/admin/contactos', payload);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar contacto');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {contacto ? 'Editar Contacto' : 'Nuevo Contacto'}
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
              placeholder="Nombre completo"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-uvm-primary"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <input
              name="rol"
              value={form.rol}
              onChange={handleChange}
              placeholder="Ej. Coordinador, Entrenador"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-uvm-primary"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-uvm-primary"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="+56 9 1234 5678"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-uvm-primary"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción del servicio
            </label>
            <textarea
              name="descripcion_servicio"
              value={form.descripcion_servicio}
              onChange={handleChange}
              placeholder="Breve descripción del servicio que ofrece"
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