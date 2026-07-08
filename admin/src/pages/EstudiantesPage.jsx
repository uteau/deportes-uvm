import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import EstudianteForm from '../components/EstudianteForm';
import EstadoBadge from '../components/EstadoBadge';

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editEstudiante, setEditEstudiante] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/usuarios');
      setEstudiantes(res.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const action = currentStatus ? 'desactivar' : 'activar';
    if (confirm(`¿${action} este estudiante?`)) {
      try {
        await apiClient.patch(`/admin/usuarios/${id}/estado`, { activo: !currentStatus });
        load();
      } catch (err) {
        alert('Error al cambiar estado');
      }
    }
  };

  const handleEdit = (estudiante) => {
    setEditEstudiante(estudiante);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditEstudiante(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditEstudiante(null);
    load();
  };

  if (loading) return <div className="text-center p-4">Cargando estudiantes...</div>;
  if (error) return <div className="text-uvm-red text-center p-4">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl mb-4">Estudiantes seleccionados</h1>
        <button onClick={handleCreate} className="bg-uvm-primary text-white px-4 py-2 rounded hover:bg-uvm-secondary">
          + Nuevo estudiante
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">RUT</th>
              <th className="px-4 py-2 text-left">Deporte</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">No hay estudiantes registrados</td>
              </tr>
            ) : (
              estudiantes.map(est => (
                <tr key={est.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <EstadoBadge activo={est.usuario.activo} />
                      <span>{est.usuario.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">{est.usuario.email}</td>
                  <td className="px-4 py-2">{est.rut}-{est.dig_verificador}</td>
                  <td className="px-4 py-2">{est.deporte?.nombre || '-'}</td>
                  <td className="px-4 py-2 w-1">
                    <div className= "flex justify-end gap-2">
                      <button onClick={() => handleEdit(est)} className="text-uvm-primary hover:text-uvm-primary mr-3 px-3 py-1 rounded hover:bg-uvm-primary/10 transition">
                        Editar
                      </button>
                      <button onClick={() => toggleStatus(est.usuario.id, est.usuario.activo)} className="text-uvm-primary hover:text-uvm-primary-dark px-3 py-1 rounded hover:bg-uvm-primary/10 transition">
                        {est.usuario.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <EstudianteForm 
          estudiante={editEstudiante} 
          onClose={handleFormClose} 
        />
      )}
    </div>
  );
}