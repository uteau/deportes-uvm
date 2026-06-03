import { useEffect, useState } from 'react';
import apiClient from '../api/client';

export default function DeportesPage() {
  const [deportes, setDeportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para el formulario de creación
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Estado para la edición inline
  // editId guarda el id del deporte que se está editando (null = ninguno)
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

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

  // Crear deporte
  const handleCreate = async () => {
    if (!newName.trim()) {
      setError('El nombre del deporte es requerido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiClient.post('/admin/deportes', {
        nombre: newName.trim(),
        descripcion: newDesc.trim() || undefined, // no enviar string vacío
      });

      setNewName('');
      setNewDesc('');
      await load();
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al crear deporte';
      setError(mensaje);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Iniciar edición: precarga los campos con los valores actuales
  const handleStartEdit = (deporte) => {
    setEditId(deporte.id);
    setEditName(deporte.nombre);
    setEditDesc(deporte.descripcion || '');
  };

  // Cancelar edición sin guardar
  const handleCancelEdit = () => {
    setEditId(null);
    setEditName('');
    setEditDesc('');
  };

  // Guardar cambios de edición con PUT /admin/deportes/:id
  const handleSaveEdit = async (id) => {
    if (!editName.trim()) {
      setError('El nombre del deporte es requerido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiClient.put(`/admin/deportes/${id}`, {
        nombre: editName.trim(),
        descripcion: editDesc.trim() || undefined,
      });

      // Limpiar estado de edición y recargar
      handleCancelEdit();
      await load();
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al actualizar deporte';
      setError(mensaje);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Eliminación lógica: el backend marca activo=false
  const handleDelete = async (id, nombre) => {
    if (confirm(`¿Eliminar el deporte "${nombre}"? Se eliminará la asignación a estudiantes.`)) {
      try {
        await apiClient.delete(`/admin/deportes/${id}`);
        await load();
      } catch (err) {
        const mensaje = err.response?.data?.message || 'Error al eliminar deporte';
        setError(mensaje);
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Deportes</h1>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-uvm-red text-uvm-red text-sm px-3 py-2 rounded mb-4">
              
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">×</button>
        </div>
      )}

      {/* Formulario de creación */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg mb-2 font-lato">Agregar deporte</h2>
        <div className="flex flex-col gap-2">
          <input
            placeholder="Nombre del deporte *"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="border p-2 rounded"
            disabled={loading}
          />
          <input
            placeholder="Descripción (opcional)"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            className="border p-2 rounded"
            disabled={loading}
          />
          <button
            onClick={handleCreate}
            disabled={loading || !newName.trim()}
            className={`px-4 py-2 rounded text-white self-start ${
              loading || !newName.trim()
                ? 'bg-uvm-secondary/60 cursor-not-allowed'
                : 'bg-uvm-primary hover:bg-uvm-secondary'
            }`}
          >
            {loading ? 'Guardando...' : 'Crear'}
          </button>
        </div>
      </div>

      {/* Listado de deportes */}
      <ul className="bg-white font-lato font-light rounded shadow divide-y">
        {deportes.length === 0 ? (
          <li className="p-3 text-center text-gray-500">No hay deportes registrados</li>
        ) : (
          deportes.map(d => (
            <li key={d.id} className="p-3 hover:bg-gray-50">
              {editId === d.id ? (
                // --- Fila en modo edición ---
                <div className="flex flex-col gap-2">
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="border p-2 rounded"
                    disabled={loading}
                  />
                  <input
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                    placeholder="Descripción (opcional)"
                    className="border p-2 rounded"
                    disabled={loading}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(d.id)}
                      disabled={loading || !editName.trim()}
                      className="px-3 py-1 bg-uvm-primary text-white rounded hover:bg-uvm-secondary disabled:bg-uvm-secondary/60"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // --- Fila en modo visualización ---
                <div className="flex justify-between items-center">
                  <div>
                    <strong>{d.nombre}</strong>
                    {d.descripcion && (
                      <p className="text-sm text-gray-500">{d.descripcion}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEdit(d)}
                      className="text-uvm-primary hover:text-uvm-primary-dark px-3 py-1 rounded hover:bg-uvm-primary/10 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(d.id, d.nombre)}
                      className="text-uvm-red hover:text-uvm-red-dark px-3 py-1 rounded hover:bg-uvm-red/5 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}