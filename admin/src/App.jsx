import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import Feed from './pages/FeedPage';
import EventosPage from './pages/EventosPage';
import PartidosPage from './pages/PartidosPage';
import AnunciosPublicosPage from './pages/AnunciosPublicosPage';
import AnunciosSeluvmPage from './pages/AnunciosSeluvmPage';
import EstudiantesPage from './pages/EstudiantesPage';
import DeportesPage from './pages/DeportesPage';
import ContactosPage from './pages/ContactosPage';

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
        <Route index                    element={<Feed />} />
        <Route path="eventos"           element={<EventosPage />} />
        <Route path="partidos"          element={<PartidosPage />} />
        <Route path="anuncios/publicos" element={<AnunciosPublicosPage />} />
        <Route path="anuncios/seluvm"   element={<AnunciosSeluvmPage />} />
        <Route path="estudiantes"       element={<EstudiantesPage />} />
        <Route path="deportes"          element={<DeportesPage />} />
        <Route path="contactos"         element={<ContactosPage />} />
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