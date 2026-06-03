import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import EventoForm from '../components/PartidoForm';
import PartidoForm from '../components/PartidoForm';

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
        <h1 className="text-2xl mb-4">Partidos</h1>
        <button onClick={() => setShowForm(true)} className="bg-uvm-primary text-white px-4 py-2 rounded hover:bg-uvm-secondary transition">
          + Nuevo partido
        </button>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Lugar</th>
              <th className="px-4 py-2 text-left">Equipo local</th>
              <th className="px-4 py-2 text-left">Equipo visitante</th>
              <th className="px-4 py-2 text-left">Resultado local</th>
              <th className="px-4 py-2 text-left">Resultado visitante</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {partidos.map(p => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-2">{p.nombre}</td>
                <td className="px-4 py-2">{new Date(p.fecha_partido).toLocaleDateString()}</td>
                <td className="px-4 py-2">{p.lugar}</td>
                <td className="px-4 py-2">{p.equipo_local}</td>
                <td className="px-4 py-2">{p.equipo_visita}</td>
                <td className="px-4 py-2">{p.resul_local}</td>
                <td className="px-4 py-2">{p.resul_visita}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEdit(p)} className="text-uvm-primary hover:text-uvm-primary-dark px-3 py-1 rounded hover:bg-uvm-primary/10 transition">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-uvm-red hover:text-uvm-red-dark px-3 py-1 rounded hover:bg-uvm-red/5 transition">
                    Eliminar
                  </button>
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