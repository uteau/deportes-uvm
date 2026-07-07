// Indicador visual reutilizable: verde = activo, rojo = inactivo.
// Mismo estilo que ya usas en EstudiantesPage.jsx para el estado de cuenta.
// export default function EstadoBadge({ activo }) {
//   return (
//     <span
//       className={`px-2 py-1 rounded text-xs font-medium ${
//         activo
//           ? 'bg-green-100 text-green-800'
//           : 'bg-uvm-red/10 text-uvm-red'
//       }`}
//     >
//       {activo ? 'Activo' : 'Inactivo'}
//     </span>
//   );
// }

// Indicador visual reutilizable: círculo verde = activo, rojo = inactivo.
export default function EstadoBadge({ activo }) {
  return (
    <span
      className={`inline-block w-3 h-3 rounded-full ${
        activo ? 'bg-green-500' : 'bg-uvm-red'
      }`}
      title={activo ? 'Activo' : 'Inactivo'} // Tooltip para accesibilidad
    />
  );
}