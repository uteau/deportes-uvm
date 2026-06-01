import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import EstudianteForm from '../components/EstudianteForm';

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
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Estudiantes seleccionados</h1>
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
              <th className="px-4 py-2 text-left">Estado</th>
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
                  <td className="px-4 py-2">{est.usuario.nombre}</td>
                  <td className="px-4 py-2">{est.usuario.email}</td>
                  <td className="px-4 py-2">{est.rut}</td>
                  <td className="px-4 py-2">{est.deporte?.nombre || '-'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${est.usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {est.usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleEdit(est)} className="text-blue-600 hover:text-blue-800 mr-3">
                      Editar
                    </button>
                    <button onClick={() => toggleStatus(est.usuario.id, est.usuario.activo)} className="text-yellow-600 hover:text-yellow-800">
                      {est.usuario.activo ? 'Desactivar' : 'Activar'}
                    </button>
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