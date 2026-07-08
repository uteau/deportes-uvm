import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import ContactoForm from '../components/ContactoForm';

export default function ContactosPage() {
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editContacto, setEditContacto] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      // Usamos el endpoint público (protegido por JWT) para listar todos los contactos
      const res = await apiClient.get('/contactos');
      setContactos(res.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar contactos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id, nombre) => {
    if (confirm(`¿Eliminar el contacto "${nombre}"?`)) {
      try {
        await apiClient.delete(`/admin/contactos/${id}`);
        load();
      } catch (err) {
        alert('Error al eliminar contacto');
      }
    }
  };

  const handleEdit = (contacto) => {
    setEditContacto(contacto);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditContacto(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditContacto(null);
    load();
  };

  if (loading) return <div className="text-center p-4">Cargando contactos...</div>;
  if (error) return <div className="text-uvm-red text-center p-4">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl mb-4">Contactos</h1>
        <button
          onClick={handleCreate}
          className="bg-uvm-primary text-white px-4 py-2 rounded hover:bg-uvm-secondary"
        >
          + Nuevo contacto
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Rol</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Teléfono</th>
              <th className="px-4 py-2 text-left">Descripción</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contactos.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No hay contactos registrados
                </td>
              </tr>
            ) : (
              contactos.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{c.nombre}</td>
                  <td className="px-4 py-2">{c.rol || '-'}</td>
                  <td className="px-4 py-2">{c.email || '-'}</td>
                  <td className="px-4 py-2">{c.telefono || '-'}</td>
                  <td className="px-4 py-2 max-w-xs truncate">
                    {c.descripcion_servicio || '-'}
                  </td>
                  <td className="px-4 py-2 w-1">
                    <div className= "flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-uvm-primary hover:text-uvm-primary mr-3 px-3 py-1 rounded hover:bg-uvm-primary/10 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.nombre)}
                        className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ContactoForm
          contacto={editContacto}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}