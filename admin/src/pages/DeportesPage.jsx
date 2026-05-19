import { useEffect, useState } from 'react';
import apiClient from '../api/client';

export default function DeportesPage() {
  const [deportes, setDeportes] = useState([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const load = async () => {
    const res = await apiClient.get('/admin/deportes');
    setDeportes(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!newName) return;
    await apiClient.post('/admin/deportes', { nombre: newName });
    setNewName('');
    setNewDesc('');
    load();
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar deporte? Se eliminará la asignación a estudiantes.')) {
      await apiClient.delete(`/admin/deportes/${id}`);
      load();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Deportes</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-semibold">Agregar deporte</h2>
        <input placeholder="Nombre" value={newName} onChange={e => setNewName(e.target.value)} className="border p-2 mr-2 rounded" />
        <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded">Crear</button>
      </div>
      <ul className="bg-white rounded shadow divide-y">
        {deportes.map(d => (
          <li key={d.id} className="p-3 flex justify-between">
            <div><strong>{d.nombre}</strong></div>
            <button onClick={() => handleDelete(d.id)} className="text-red-600">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}