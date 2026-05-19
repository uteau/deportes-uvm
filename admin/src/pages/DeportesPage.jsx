import { useEffect, useState } from 'react';
import apiClient from '../api/client';

export default function DeportesPage() {
  const [deportes, setDeportes] = useState([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const res = await apiClient.get('/admin/deportes');
      setDeportes(res.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar deportes');
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    // Validación
    if (!newName.trim()) {
      setError('El nombre del deporte es requerido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Enviar ambos campos (nombre y descripción)
      await apiClient.post('/admin/deportes', { 
        nombre: newName.trim(),
      });
      
      // Limpiar formulario
      setNewName('');
      setNewDesc('');
      
      // Recargar lista
      await load();
      
    } catch (err) {
      const mensaje = err.response?.data?.error?.message || 'Error al crear deporte';
      setError(mensaje);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (confirm(`¿Eliminar el deporte "${nombre}"? Se eliminará la asignación a estudiantes.`)) {
      try {
        await apiClient.delete(`/admin/deportes/${id}`);
        await load();
      } catch (err) {
        const mensaje = err.response?.data?.error?.message || 'Error al eliminar deporte';
        setError(mensaje);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Deportes</h1>
      
      {/* Mostrar errores */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">×</button>
        </div>
      )}
      
      {/* Formulario de creación */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-semibold mb-2">Agregar deporte</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input 
            placeholder="Nombre del deporte *" 
            value={newName} 
            onChange={e => setNewName(e.target.value)} 
            className="border p-2 rounded flex-1"
            disabled={loading}
          />
          <button 
            onClick={handleCreate} 
            disabled={loading || !newName.trim()}
            className={`px-4 py-2 rounded text-white ${
              loading || !newName.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </div>
      
      {/* Listado de deportes */}
      <ul className="bg-white rounded shadow divide-y">
        {deportes.length === 0 ? (
          <li className="p-3 text-center text-gray-500">No hay deportes registrados</li>
        ) : (
          deportes.map(d => (
            <li key={d.id} className="p-3 flex justify-between items-center hover:bg-gray-50">
              <div>
                <strong>{d.nombre}</strong>
              </div>
              <button 
                onClick={() => handleDelete(d.id, d.nombre)} 
                className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50"
              >
                Eliminar
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}