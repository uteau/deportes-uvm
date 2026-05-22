import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export default function EstudianteForm({ estudiante, onClose }) {
  const [deportes, setDeportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    estudiante_id: '',
    deporte_id: ''
  });

  useEffect(() => {
    // Cargar lista de deportes
    apiClient.get('/admin/deportes').then(res => setDeportes(res.data));
    
    // Si es edición, cargar datos del estudiante
    if (estudiante) {
      setForm({
        nombre: estudiante.usuario.nombre || '',
        email: estudiante.usuario.email || '',
        password: '', // No se carga la contraseña por seguridad
        estudiante_id: estudiante.estudiante_id || '',
        deporte_id: estudiante.deporte?.id || ''
      });
    }
  }, [estudiante]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (estudiante) {
        // Edición: solo actualizar campos permitidos (no incluir password si está vacío)
        const updateData = {
          nombre: form.nombre,
          email: form.email,
          estudiante_id: form.estudiante_id,
          deporte_id: form.deporte_id
        };
        if (form.password && form.password.trim() !== '') {
          updateData.password = form.password;
        }
        await apiClient.put(`/admin/usuarios/${estudiante.usuario_id}`, updateData);
      } else {
        // Creación: enviar todos los campos
        await apiClient.post('/admin/usuarios', form);
      }
      onClose();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {estudiante ? 'Editar Estudiante' : 'Nuevo Estudiante'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input 
            name="nombre" 
            placeholder="Nombre completo" 
            value={form.nombre} 
            onChange={e => setForm({...form, nombre: e.target.value})} 
            className="w-full p-2 border mb-2 rounded" 
            required 
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Correo electrónico" 
            value={form.email} 
            onChange={e => setForm({...form, email: e.target.value})} 
            className="w-full p-2 border mb-2 rounded" 
            required 
          />
          <input 
            name="password" 
            type="password" 
            placeholder={estudiante ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña"} 
            value={form.password} 
            onChange={e => setForm({...form, password: e.target.value})} 
            className="w-full p-2 border mb-2 rounded" 
            required={!estudiante} 
          />
          <input 
            name="estudiante_id" 
            placeholder="Número de matrícula" 
            value={form.estudiante_id} 
            onChange={e => setForm({...form, estudiante_id: e.target.value})} 
            className="w-full p-2 border mb-2 rounded" 
            required 
          />
          <select 
            name="deporte_id" 
            value={form.deporte_id} 
            onChange={e => setForm({...form, deporte_id: e.target.value})} 
            className="w-full p-2 border mb-4 rounded" 
            required
          >
            <option value="">Seleccionar deporte</option>
            {deportes.map(d => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
          
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}