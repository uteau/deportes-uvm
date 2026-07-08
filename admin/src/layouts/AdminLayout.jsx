import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  // useLocation permite saber la ruta activa para resaltar el link del sidebar
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Feed',              path: '/' },
    { name: 'Eventos',                path: '/eventos' },
    { name: 'Partidos',               path: '/partidos' },
    { name: 'Anuncios Públicos',      path: '/anuncios/publicos' },
    { name: 'Anuncios Seleccionados', path: '/anuncios/seluvm' },
    { name: 'Estudiantes seleccionados',      path: '/estudiantes' },
    { name: 'Deportes',               path: '/deportes' },
    { name: 'Contactos',              path: '/contactos' },
  ];

  // Determina si un link está activo comparando la ruta actual
  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-gray-100 font-lato">

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-uvm-secondary flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>

        {/* Cabecera del sidebar */}
        <div className="bg-uvm-secondary px-5 py-4">
          <span className="font-oswald text-white text-lg uppercase tracking-widest">
            Deportes UVM
          </span>
          <p className="text-gray-400 text-xs mt-0.5">Panel de Administración</p>
        </div>

        {/* Links de navegación */}
        <nav className="flex-1 mt-2 overflow-y-auto">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)} // cerrar en móvil al navegar
              className={`
                flex items-center px-5 py-3 text-sm uppercase tracking-wide
                transition-colors duration-150
                ${isActive(item.path)
                  ? 'bg-uvm-white text-uvm-primary/60'       // activo
                  : 'text-white hover:bg-uvm-primary/60'        // inactivo
                }
              `}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Cerrar sesión al fondo del sidebar */}
        <button
          onClick={handleLogout}
          className="px-5 py-4 text-sm uppercase tracking-wide text-white
                     border-t border-white/20 hover:bg-uvm-red
                     transition-colors duration-150 text-left"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* ── Contenido principal ───────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar — solo visible en móvil */}
        <header className="bg-uvm-primary shadow-sm px-4 py-3 lg:hidden flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white text-2xl leading-none"
          >
            ☰
          </button>
          <span className="font-oswald text-white uppercase tracking-widest text-base">
            Deportes UVM
          </span>
          {/* Espaciador para centrar el título */}
          <div className="w-8" />
        </header>

        {/* Área de contenido de cada página */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

      {/* Overlay oscuro al abrir sidebar en móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}