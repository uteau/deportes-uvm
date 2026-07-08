import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import EventoForm from '../components/PartidoForm';
import PartidoForm from '../components/PartidoForm';
import EstadoBadge from '../components/EstadoBadge';

export default function PartidosPage() {
  const [partidos, setPartidos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPartido, setEditingPartido] = useState(null);

  const loadPartidos = async () => {
    const res = await apiClient.get('/admin/partidos'); // endpoint público
    setPartidos(res.data);
  };

  useEffect(() => {
    loadPartidos();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const action = currentStatus ? 'desactivar' : 'activar';
    if (confirm(`¿${action} este partido?`)) {
      try {
        await apiClient.patch(`/admin/partidos/${id}`, { activo: !currentStatus });
        loadPartidos();
      } catch (err) {
        alert('Error al activar/desactivar');
      }
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
      <div className="space-y-2">
        {partidos.map(p => (
          <div
              key={p.id}
              className="bg-white p-3 rounded shadow flex items-center gap-3"
            >
            <EstadoBadge activo={p.activo} />

            <div className="flex-1">
              <strong className="block">{p.nombre}</strong>
              <p className="text-gray-600 text-sm">{p.deporte?.nombre}</p>
              <p className="text-gray-600 text-sm">{p.lugar}</p>
              <p className="text-gray-600 text-sm">{new Date(p.fecha_partido).toLocaleDateString()}</p>
            </div>

            {/* 3. Equipo local + resultado */}
            <div className="flex text-center flex-col items-center">
              <div className="font-medium">{p.equipo_local}</div>
              <div className="text-xl font-bold">{p.resul_local ?? '-'}</div>
            </div>

            {/* 4. Equipo visitante - centrado */}
            <div className="flex-1 text-center flex flex-col items-center">
              <div className="font-medium">{p.equipo_visita}</div>
              <div className="text-xl font-bold">{p.resul_visita ?? '-'}</div>
            </div>

            {/* 5. Botones */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleEdit(p)}
                className="text-uvm-primary hover:text-uvm-primary-dark px-3 py-1 rounded hover:bg-uvm-primary/10 transition"
              >
                Editar
              </button>
              <button
                onClick={() => toggleStatus(p.id, p.activo)}
                className="text-uvm-primary hover:text-uvm-primary-dark px-3 py-1 rounded hover:bg-uvm-primary/10 transition"
              >
                {p.activo ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
          ))}
      </div>
      {showForm && <PartidoForm partido={editingPartido} onClose={handleFormClose} />}
    </div>
  );
}