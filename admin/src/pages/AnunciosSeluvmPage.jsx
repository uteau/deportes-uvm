import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import AnuncioForm from '../components/AnuncioForm';

export default function AnunciosSeluvmPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const load = async () => {
    const res = await apiClient.get('/anuncios/seluvm');
    setAnuncios(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar?')) {
      await apiClient.delete(`/admin/anuncios/${id}`);
      load();
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Anuncios SelUVM</h1>
        <button onClick={() => { setEditItem(null); setShowForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded">+ Nuevo</button>
      </div>
      <div className="space-y-2">
        {anuncios.map(a => (
          <div key={a.id} className="bg-white p-3 rounded shadow flex justify-between">
            <div><strong>{a.titulo}</strong><p>{a.contenido}</p></div>
            <div>
              <button onClick={() => { setEditItem(a); setShowForm(true); }} className="text-blue-600 mr-2">Editar</button>
              <button onClick={() => handleDelete(a.id)} className="text-red-600">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      {showForm && <AnuncioForm tipo="seluvm" anuncio={editItem} onClose={() => { setShowForm(false); load(); }} />}
    </div>
  );
}