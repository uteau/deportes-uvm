import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import EventoForm from '../components/PartidoForm';

export default function PartidosPage() {
  const [partidos, setPartidos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPartido, setEditingPartido] = useState(null);

  const loadPartidos = async () => {
    const res = await apiClient.get('/partidos'); // endpoint público
    setPartidos(res.data);
  };

  useEffect(() => {
    loadPartidos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar partido?')) {
      await apiClient.delete(`/admin/partidos/${id}`);
      loadPartidos();
    }
  };

  const handleEdit = (partido) => {
    setEditingPartido(partido);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPartido(null);
    loadPartidos();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Partidos</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded">+ Nuevo partido</button>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-2 text-left">Nombre</th><th>Fecha</th><th>Lugar</th><th>Equipo local</th><th>Equipo visitante</th><th>Resultado local</th><th>Resultado visitante</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {partidos.map(p => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-2">{p.nombre}</td>
                <td className="px-4 py-2">{new Date(p.fecha_evento).toLocaleDateString()}</td>
                <td className="px-4 py-2">{p.lugar}</td>
                <td className="px-4 py-2">{p.equipo_local}</td>
                <td className="px-4 py-2">{p.equipo_visita}</td>
                <td className="px-4 py-2">{p.resultado_local}</td>
                <td className="px-4 py-2">{p.resultado_visita}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 mr-2">Editar</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && <PartidoForm partido={editingPartido} onClose={handleFormClose} />}
    </div>
  );
}