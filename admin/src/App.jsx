import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import EventosPage from './pages/EventosPage';
import PartidosPage from './pages/PartidosPage';
import AnunciosPublicosPage from './pages/AnunciosPublicosPage';
import AnunciosSeleccionadosPage from './pages/AnunciosSeluvmPage';
import EstudiantesPage from './pages/EstudiantesPage';
import DeportesPage from './pages/DeportesPage';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-4">Cargando...</div>;
  if (!user || user.rol !== 'admin') return <Navigate to="/login" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="eventos" element={<EventosPage />} />
        <Route path="partidos" element={<PartidosPage />} />
        <Route path="anuncios/publicos" element={<AnunciosPublicosPage />} />
        <Route path="anuncios/seluvm" element={<AnunciosSeluvmPage />} />
        <Route path="estudiantes" element={<EstudiantesPage />} />
        <Route path="deportes" element={<DeportesPage />} />

        {/* <Route index element={<Dashboard />} />
        <Route path="eventos" element={<div>Eventos - Próximamente</div>} />
        <Route path="partidos" element={<div>Partidos - Próximamente</div>} />
        <Route path="anuncios/publicos" element={<div>Anuncios públicos - Próximamente</div>} />
        <Route path="anuncios/seluvm" element={<div>Anuncios seleccionados - Próximamente</div>} />
        <Route path="estudiantes" element={<div>Estudiantes - Próximamente</div>} />
        <Route path="deportes" element={<div>Deportes - Próximamente</div>} /> */}
        
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}