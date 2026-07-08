import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import AnuncioForm from '../components/AnuncioForm';
import EstadoBadge from '../components/EstadoBadge';

export default function AnunciosSeluvmPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const loadAnuncios = async () => {
    const res = await apiClient.get('/admin/anuncios/seluvm');
    setAnuncios(res.data);
  };

  useEffect(() => { loadAnuncios(); }, []);

  const toggleStatus = async (id, currentStatus) => {
    const action = currentStatus ? 'desactivar' : 'activar';
    if (confirm(`¿${action} este anuncio?`)) {
      try {
        await apiClient.patch(`/admin/anuncios/${id}`, { activo: !currentStatus });
        loadAnuncios();
      } catch (err) {
        alert('Error al activar/desactivar');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl mb-4">Anuncios SelUVM</h1>
        <button onClick={() => { setEditItem(null); setShowForm(true); }} className="bg-uvm-primary text-white px-4 py-2 rounded hover:bg-uvm-secondary transition">
          + Nuevo
        </button>
      </div>
      <div className="space-y-2">
        {anuncios.map(a => (
          <div key={a.id} className="bg-white p-3 rounded shadow flex items-center gap-3">
            <EstadoBadge activo={a.activo} />
            <div className="flex-1">
              <strong className="block">{a.titulo}</strong>
              <p className="text-gray-600 text-sm">{a.contenido}</p>
              {a.instagram_url && (
                <a href={a.instagram_url} className="text-blue-500 text-sm hover:underline">
                  Instagram
                </a>
              )}
            </div>

            <div>
              <button onClick={() => { setEditItem(a); setShowForm(true); }} className="text-uvm-primary hover:text-uvm-primary-dark px-3 py-1 rounded hover:bg-uvm-primary/10 transition">
                Editar
              </button>
              <button onClick={() => toggleStatus(a.id, a.activo)} className="text-uvm-primary hover:text-uvm-primary-dark px-3 py-1 rounded hover:bg-uvm-primary/10 transition">
                {a.activo ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {showForm && <AnuncioForm tipo="seluvm" anuncio={editItem} onClose={() => { setShowForm(false); loadAnuncios(); }} />}
    </div>
  );
}