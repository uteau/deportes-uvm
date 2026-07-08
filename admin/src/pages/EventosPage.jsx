import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import EventoForm from '../components/EventoForm';
import EstadoBadge from '../components/EstadoBadge';

export default function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvento, setEditingEvento] = useState(null);

  const loadEventos = async () => {
    const res = await apiClient.get('/admin/eventos');
    setEventos(res.data);
  };

  useEffect(() => {
    loadEventos();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const action = currentStatus ? 'desactivar' : 'activar';
    if (confirm(`¿${action} este evento?`)) {
      try {
        await apiClient.patch(`/admin/eventos/${id}`, { activo: !currentStatus });
        loadEventos();
      } catch (err) {
        alert('Error al activar/desactivar');
      }
    }
  };

  const handleEdit = (evento) => {
    setEditingEvento(evento);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEvento(null);
    loadEventos();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl mb-4">Eventos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-uvm-primary text-white px-4 py-2 rounded hover:bg-uvm-secondary transition"
        >
          + Nuevo evento
        </button>
      </div>

      <div className="space-y-2">
        {eventos.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No hay eventos registrados</div>
        ) : (
          eventos.map((e) => (
            <div
              key={e.id}
              className="bg-white p-3 rounded shadow flex items-center gap-3"
            >
              <EstadoBadge activo={e.activo} />

              <div className="flex-1">
                <strong className="block">{e.nombre}</strong>
                <p className="text-gray-600 text-sm">
                  {new Date(e.fecha_evento).toLocaleDateString()} • {e.lugar}
                </p>
              </div>

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => handleEdit(e)}
                  className="text-uvm-primary hover:text-uvm-primary-dark px-3 py-1 rounded hover:bg-uvm-primary/10 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => toggleStatus(e.id, e.activo)}
                  className="text-uvm-primary hover:text-uvm-primary-dark px-3 py-1 rounded hover:bg-uvm-primary/10 transition"
                >
                  {e.activo ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <EventoForm
          evento={editingEvento}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}