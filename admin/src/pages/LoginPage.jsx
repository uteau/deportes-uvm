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
      setError(err.response?.data?.error?.message || 'Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Panel Deportivo UVM</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border mb-2 rounded" required />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border mb-4 rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Ingresar</button>
      </form>
    </div>
  );
}