import { useEffect, useState } from 'react';
import apiClient from '../api/client';

export default function Dashboard() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFeed = async () => {
    try {
      const res = await apiClient.get('/feed');
      setFeed(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  if (loading) return <div className="text-center p-4">Cargando feed...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Feed de actividad</h1>
      <div className="space-y-4">
        {feed.length === 0 && <p>No hay contenido reciente.</p>}
        {feed.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">
              {item.tipo_item === 'evento' && 'Evento'}
              {item.tipo_item === 'partido' && 'Partido'}
              {item.tipo_item === 'anuncio' && 'Anuncio'}
            </div>
            <h2 className="text-xl font-semibold">{item.nombre || item.titulo}</h2>
            {item.descripcion && <p>{item.descripcion}</p>}
            {item.contenido && <p>{item.contenido}</p>}
            {item.fecha_evento && <p className="text-sm">Fecha: {new Date(item.fecha_evento).toLocaleString()}</p>}
            {item.fecha_partido && <p className="text-sm">Fecha: {new Date(item.fecha_partido).toLocaleString()}</p>}
            {item.lugar && <p className="text-sm">Lugar: {item.lugar}</p>}
            {item.equipo_local && 
              <p>
                {item.equipo_local} vs {item.equipo_visita}
                 {item.resul_local !== null && item.resul_local !== undefined && 
                    item.resul_visita !== null && item.resul_visita !== undefined && (
                      <> - {item.resul_local} : {item.resul_visita}</>
                    )
                  }
                </p>}
            {item.instagram_url && <a href={item.instagram_url} target="_blank" rel="noreferrer" className="text-blue-500">Ver en Instagram</a>}
          </div>
        ))}
      </div>
    </div>
  );
}