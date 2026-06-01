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
    <div 
      className="min-h-screen flex items-center justify-center  font-sans"
      style={{ backgroundColor: '#212529' }}
    >
      <form 
        onSubmit={handleSubmit} 
        className="p-6 rounded shadow-md w-96"
        style={{ backgroundColor: '#5B6770' }}
      >
        <h1 className="text-2xl font-bold mb-4 text-white">Panel Admin UVM</h1>
        
        {error && <div className="text-red-200 mb-2">{error}</div>}
        
        <input 
          type="email" 
          placeholder="Correo" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="w-full p-2 border mb-2 rounded text-gray-800"
          style={{ backgroundColor: '#f8f9fa' }}
          required 
        />
        
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className="w-full p-2 border mb-4 rounded text-gray-800"
          style={{ backgroundColor: '#f8f9fa' }}
          required 
        />
        
        <button 
          type="submit" 
          className="w-full text-gray-800 p-2 rounded hover:opacity-90 transition"
          style={{ backgroundColor: '#f8f9fa' }}
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}