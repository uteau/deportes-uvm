import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import EventoForm from '../components/EventoForm';

export default function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvento, setEditingEvento] = useState(null);

  const loadEventos = async () => {
    const res = await apiClient.get('/eventos'); // endpoint público
    setEventos(res.data);
  };

  useEffect(() => {
    loadEventos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar evento?')) {
      await apiClient.delete(`/admin/eventos/${id}`);
      loadEventos();
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
        <h1 className="text-2xl font-bold">Eventos</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded">+ Nuevo evento</button>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-2 text-left">Nombre</th><th>Fecha</th><th>Lugar</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {eventos.map(e => (
              <tr key={e.id} className="border-t">
                <td className="px-4 py-2">{e.nombre}</td>
                <td className="px-4 py-2">{new Date(e.fecha_evento).toLocaleDateString()}</td>
                <td className="px-4 py-2">{e.lugar}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEdit(e)} className="text-blue-600 mr-2">Editar</button>
                  <button onClick={() => handleDelete(e.id)} className="text-red-600">Eliminar</button>
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