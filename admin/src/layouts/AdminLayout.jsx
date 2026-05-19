import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Eventos', path: '/eventos' },
    { name: 'Partidos', path: '/partidos' },
    { name: 'Anuncios Públicos', path: '/anuncios/publicos' },
    { name: 'Anuncios Seleccionados', path: '/anuncios/seluvm' },
    { name: 'Estudiantes', path: '/estudiantes' },
    { name: 'Deportes', path: '/deportes' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar para escritorio */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="p-4 font-bold text-xl border-b">Admin UVM</div>
        <nav className="mt-4">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
              <span>{item.icon}</span> {item.name}
            </Link>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 mt-4 text-red-600">
            Cerrar sesión
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 lg:hidden flex justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-2xl">☰</button>
          <h1 className="font-bold">Admin UVM</h1>
          <div className="w-8"></div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>

      {/* Overlay para móvil */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
}