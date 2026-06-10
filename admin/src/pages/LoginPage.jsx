import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const rol = await login(email, password);
      if (rol === 'admin') navigate('/');
      else setError('Acceso solo para administradores');
    } catch (err) {
      setError(err.response?.data?.message || 'Usuario o contraseña incorrectos. Intente nuevamente.');
    }
  };

  return (
    // Fondo oscuro institucional
    <div className="min-h-screen flex items-center justify-center bg-uvm-primary font-lato">
      <div className="w-full max-w-sm">

        {/* Logo / título institucional */}
        <h1 className="font-oswald text-white text-center text-3xl uppercase tracking-widest mb-8">
          Deportes UVM
        </h1>

        <form 
          onSubmit={handleSubmit} 
          className="bg-uvm-white rounded shadow-lg p-8">
          <h2 className="font-lato text-uvm-primary text-center text-xl uppercase tracking-wide mb-6">
            Panel de Administración
          </h2>

          {/* <p className="text-uvm-secondary text-sm mb-6">
            Ingresa con tu cuenta institucional
          </p> */}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 mb-3 rounded text-uvm-text
                       focus:outline-none focus:border-uvm-primary focus:ring-1 focus:ring-uvm-primary"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 mb-6 rounded text-uvm-text
                       focus:outline-none focus:border-uvm-primary focus:ring-1 focus:ring-uvm-primary"
            required
          />

          <button
            type="submit"
            className="w-full bg-uvm-primary text-white font-lato tracking-wide
                       py-2 rounded hover:bg-uvm-secondary transition-colors duration-200 mb-6"
          >
            Ingresar
          </button>

          {/* Error de login */}
          {error && (
            <div className="bg-red-50 border border-uvm-red text-uvm-red text-sm px-3 py-2 rounded mb-4">
              {error}
            </div>
          )}
          
        </form>

      </div>
    </div>
  );
}