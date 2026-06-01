import { useState, useEffect } from 'react';
import apiClient from '../api/client';

// ─── Lógica de validación de RUT chileno ─────────────────────────────────────

// Calcula el dígito verificador esperado dado el RUT sin DV.
// Algoritmo módulo 11: multiplica cada dígito por una secuencia 2,3,4,5,6,7
// que se repite, suma los productos, resta el módulo de 11 y mapea el resultado.
function calcularDV(rut) {
  const rutNum = parseInt(rut, 10);
  if (isNaN(rutNum) || rutNum < 1000000) return null;

  let suma = 0;
  let multiplo = 2;
  let r = rutNum;

  // Recorre los dígitos del RUT de derecha a izquierda
  while (r > 0) {
    suma += (r % 10) * multiplo;
    r = Math.floor(r / 10);
    multiplo = multiplo < 7 ? multiplo + 1 : 2; // ciclo 2-7
  }

  const dvNum = 11 - (suma % 11);

  // Mapeo: 11 → 0, 10 → K (que guardamos como 10), resto → el número mismo
  if (dvNum === 11) return 0;
  if (dvNum === 10) return 10; // K
  return dvNum;
}

// Convierte el DV numérico interno (0-10) a string para mostrar al usuario
function dvAString(dvNum) {
  if (dvNum === null || dvNum === undefined || dvNum === '') return '';
  if (Number(dvNum) === 10) return 'K';
  return dvNum.toString();
}

// Convierte el string del input ('0'-'9' o 'K'/'k') al número que se guarda
function dvANum(dvStr) {
  const upper = dvStr.toUpperCase();
  if (upper === 'K') return 10;
  const n = parseInt(dvStr, 10);
  return isNaN(n) ? null : n;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function EstudianteForm({ estudiante, onClose }) {
  const [deportes, setDeportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dvError, setDvError] = useState(''); // mensaje de error del DV

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rut: '',           // string en el input, se parsea a Int al enviar
    dig_verificador: '', // '0'-'9' o 'K' en el input, se convierte a Int al enviar
    deporte_id: ''
  });

  useEffect(() => {
    // Cargar lista de deportes activos para el selector
    apiClient.get('/admin/deportes').then(res => setDeportes(res.data));

    // Si es edición, precargar los datos actuales del estudiante
    if (estudiante) {
      setForm({
        nombre: estudiante.usuario.nombre || '',
        email: estudiante.usuario.email || '',
        password: '',
        rut: estudiante.rut?.toString() || '',
        // dig_verificador viene como Int del backend; lo convertimos a string para el input
        dig_verificador: dvAString(estudiante.dig_verificador),
        deporte_id: estudiante.deporte?.id || ''
      });
    }
  }, [estudiante]);

  // Maneja cambios en el campo RUT: solo permite dígitos
  const handleRutChange = (e) => {
    const valor = e.target.value.replace(/\D/g, ''); // elimina todo lo que no sea dígito
    setForm(prev => ({ ...prev, rut: valor }));
    setDvError(''); // limpiar error al editar
  };

  // Maneja cambios en el campo DV: solo permite 0-9 o K/k, máximo 1 carácter
  const handleDvChange = (e) => {
    const valor = e.target.value.toUpperCase().replace(/[^0-9K]/g, ''); // solo 0-9 y K
    const ultimo = valor.slice(-1); // tomar solo el último carácter ingresado
    setForm(prev => ({ ...prev, dig_verificador: ultimo }));
    setDvError('');
  };

  // Valida el DV cuando el usuario sale del campo (onBlur)
  const handleDvBlur = () => {
    if (!form.rut || !form.dig_verificador) return;

    const dvEsperado = calcularDV(form.rut);
    const dvIngresado = dvANum(form.dig_verificador);

    if (dvEsperado === null) {
      setDvError('RUT inválido');
      return;
    }

    if (dvIngresado !== dvEsperado) {
      // Mostrar el DV correcto para ayudar al usuario
      setDvError(`DV incorrecto. El DV para este RUT es: ${dvAString(dvEsperado)}`);
    } else {
      setDvError('');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar DV antes de enviar
    const dvEsperado = calcularDV(form.rut);
    const dvIngresado = dvANum(form.dig_verificador);

    if (dvEsperado === null || dvIngresado !== dvEsperado) {
      setDvError(`DV incorrecto. El DV para este RUT es: ${dvAString(dvEsperado)}`);
      return;
    }

    setLoading(true);

    try {
      if (estudiante) {
        // Edición: construir payload con los campos permitidos
        const updateData = {
          nombre: form.nombre,
          email: form.email,
          rut: parseInt(form.rut, 10),
          dig_verificador: dvIngresado, // ya es número (0-10)
          deporte_id: form.deporte_id,
        };

        // Solo incluir password si el admin escribió uno nuevo
        if (form.password && form.password.trim() !== '') {
          updateData.password = form.password;
        }

        await apiClient.put(`/admin/usuarios/${estudiante.usuario_id}`, updateData);
      } else {
        // Creación: enviar todos los campos
        await apiClient.post('/admin/usuarios', {
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          rut: parseInt(form.rut, 10),
          dig_verificador: dvIngresado, // K se guarda como 10
          deporte_id: form.deporte_id,
        });
      }

      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {estudiante ? 'Editar Estudiante' : 'Nuevo Estudiante'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            className="w-full p-2 border mb-2 rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border mb-2 rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder={estudiante ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border mb-2 rounded"
            required={!estudiante}
          />

          {/* RUT y dígito verificador en la misma fila */}
          <div className="flex gap-2 mb-1">
            <div className="flex-1">
              <input
                name="rut"
                type="text"
                inputMode="numeric" // teclado numérico en móvil sin las flechas de type=number
                placeholder="RUT (sin dígito verificador)"
                value={form.rut}
                onChange={handleRutChange}
                className="w-full p-2 border rounded"
                maxLength={8}
                required
              />
            </div>
            <div className="w-20">
              <input
                name="dig_verificador"
                type="text"
                inputMode="text"
                placeholder="DV"
                value={form.dig_verificador}
                onChange={handleDvChange}
                onBlur={handleDvBlur} // valida al salir del campo
                className={`w-full p-2 border rounded text-center uppercase ${dvError ? 'border-red-500' : ''}`}
                maxLength={1}
                required
              />
            </div>
          </div>

          {/* Mensaje de error del DV, aparece solo si hay error */}
          {dvError && (
            <p className="text-red-500 text-sm mb-2">{dvError}</p>
          )}

          <select
            name="deporte_id"
            value={form.deporte_id}
            onChange={handleChange}
            className="w-full p-2 border mb-4 rounded"
            required
          >
            <option value="">Seleccionar deporte</option>
            {deportes.map(d => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !!dvError}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}