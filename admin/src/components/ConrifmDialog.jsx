// export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
//         <div className="p-4 border-b">
//           <h2 className="text-xl font-semibold">{title || 'Confirmar acción'}</h2>
//         </div>
        
//         <div className="p-4">
//           <p>{message || '¿Estás seguro de realizar esta acción?'}</p>
//         </div>
        
//         <div className="p-4 border-t flex justify-end gap-2">
//           <button
//             onClick={onCancel}
//             className="px-4 py-2 border rounded hover:bg-gray-100"
//           >
//             Cancelar
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Eliminar
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }