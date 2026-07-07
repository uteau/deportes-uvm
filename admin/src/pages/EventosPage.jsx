import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import EventoForm from '../components/EventoForm';
import EstadoBadge from '../components/EstadoBadge';

export default function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvento, setEditingEvento] = useState(null);

  const loadEventos = async () => {
    const res = await apiClient.get('/admin/eventos'); // endpoint público
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
        <button onClick={() => setShowForm(true)} className="bg-uvm-primary text-white px-4 py-2 rounded hover:bg-uvm-secondary transition">
          + Nuevo evento
        </button>
      </div>
      <div className="space-y-2">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Lugar</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map(e => (
              <tr key={e.id} className="border-t">
                <td className="px-4 py-2"><div className="flex items-center gap-2">
                    <EstadoBadge activo={e.activo} />
                    <span>{e.nombre}</span>
                  </div></td>
                <td className="px-4 py-2">{new Date(e.fecha_evento).toLocaleDateString()}</td>
                <td className="px-4 py-2">{e.lugar}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEdit(e)} className="text-uvm-primary hover:text-uvm-primary-dark px-3 py-1 rounded hover:bg-uvm-primary/10 transition">
                    Editar
                  </button>
                  <button onClick={() => toggleStatus(e.id, e.activo)} className="text-uvm-primary hover:text-uvm-primary-dark px-3 py-1 rounded hover:bg-uvm-primary/10 transition">
                    {e.activo ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && <EventoForm evento={editingEvento} onClose={handleFormClose} />}
    </div>
  );
}