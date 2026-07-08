import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import DeporteForm from '../components/DeporteForm';
import EstadoBadge from '../components/EstadoBadge';

export default function DeportesPage() {
  const [deportes, setDeportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editDeporte, setEditDeporte] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/deportes');
      setDeportes(res.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar deportes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = () => {
    setEditDeporte(null);
    setShowForm(true);
  };

  const toggleStatus = async (id, currentStatus) => {
    const action = currentStatus ? 'desactivar' : 'activar';
    if (confirm(`¿${action} este deporte?`)) {
      try {
        await apiClient.patch(`/admin/deportes/${id}`, { activo: !currentStatus });
        load();
      } catch (err) {
        alert('Error al activar/desactivar');
      }
    }
  };

  const handleEdit = (deporte) => {
    setEditDeporte(deporte);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditDeporte(null);
    load();
  };

  if (loading && deportes.length === 0) return <div className="text-center p-4">Cargando deportes...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl mb-4">Deportes</h1>
        <button
          onClick={handleCreate}
          className="bg-uvm-primary text-white px-4 py-2 rounded hover:bg-uvm-secondary transition"
        >
          + Nuevo deporte
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-uvm-red text-uvm-red text-sm px-3 py-2 rounded mb-4">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">×</button>
        </div>
      )}

      <div className="space-y-2">
        {deportes.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No hay deportes registrados</div>
        ) : (
          deportes.map((d) => (
            <div
              key={d.id}
              className="bg-white p-3 rounded shadow flex items-center gap-3"
            >
              <EstadoBadge activo={d.activo} />

              <div className="flex-1">
                <strong className="block">{d.nombre}</strong>
                {d.descripcion && (
                  <p className="text-gray-600 text-sm">{d.descripcion}</p>
                )}
              </div>

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => handleEdit(d)}
                  className="text-uvm-primary hover:text-uvm-primary-dark px-3 py-1 rounded hover:bg-uvm-primary/10 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => toggleStatus(d.id, d.activo)}
                  className="text-uvm-primary hover:text-uvm-primary-dark px-3 py-1 rounded hover:bg-uvm-primary/10 transition"
                >
                  {d.activo ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <DeporteForm
          deporte={editDeporte}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}