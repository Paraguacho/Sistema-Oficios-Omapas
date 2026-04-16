// DocumentTable.jsx
import { 
  ChevronRightIcon, 
  ChevronLeftIcon, 
  PencilSquareIcon,
  StarIcon
} from '@heroicons/react/24/outline'; 
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const DocumentTable = ({
  currentDocuments,
  selectedIds,
  isLoading,
  currentPage,
  totalPages,
  handleSelectRow,
  toggleSingleStar,
  goToPreviousPage,
  goToNextPage,
  currentUserId
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <table className="w-full text-left table-fixed">
        <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-zinc-100/50">
          <tr className="border-b border-zinc-100 text-zinc-400 text-[11px] uppercase tracking-[0.1em] font-black">
            <th className="px-8 py-4 w-28"></th> 
            <th className="px-2 py-4 w-1/3">Remitente / Departamento</th>
            <th className="px-6 py-4 w-auto">Asunto</th>
            <th className="px-6 py-4 w-72">
              <div className="flex items-center justify-between">
                <span>Fecha de Recepción</span>
                <div className="flex items-center gap-1 text-zinc-400">
                  <button onClick={goToPreviousPage} disabled={currentPage === 1} className="p-1 rounded hover:bg-zinc-100 hover:text-sky-600 transition disabled:opacity-30">
                    <ChevronLeftIcon className="w-5 h-5" strokeWidth={2.5} />
                  </button>
                  <span className="text-xs font-bold text-zinc-500 mx-1">{currentPage} / {totalPages}</span>
                  <button onClick={goToNextPage} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-zinc-100 hover:text-sky-600 transition disabled:opacity-30">
                    <ChevronRightIcon className="w-5 h-5" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </th>
            <th className="px-8 py-4 w-24"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50 text-sm">
          {currentDocuments.length > 0 ? currentDocuments.map((doc) => {
            //Dentro del arreglo de destinatarios
            const myStatus = doc.recipients?.find(r => r.user === currentUserId) || {};

            // Extraer los estados desde el DTO
            const isRead = myStatus.seen === true; 
            const isStarred = myStatus.isStarred === true;
            const isUrgent = doc.priority === 'Urgente' || doc.priority === 'Alta';
            const requiresSignature = doc.requiresSignature;
            const isChecked = selectedIds.includes(doc.id);

            return (
              <tr 
                key={doc.id} 
                className={`transition group cursor-pointer border-b border-zinc-50 ${
                    isChecked ? 'bg-sky-50/50' : (isRead ? 'bg-zinc-50/80 opacity-60' : 'bg-white hover:bg-sky-50/40')
                }`}
                onClick={() => handleSelectRow(doc.id)} 
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSelectRow(doc.id)}
                      onClick={(e) => e.stopPropagation()} 
                      className="w-[18px] h-[18px] rounded border-zinc-300 text-sky-600 focus:ring-sky-600 cursor-pointer"
                    />
                    <button
                      onClick={(e) => toggleSingleStar(e, doc.id, isStarred)}
                      className="text-zinc-300 hover:text-amber-400 transition transform hover:scale-110"
                    >
                      {isStarred ? <StarIconSolid className="w-6 h-6 text-amber-400" /> : <StarIcon className="w-6 h-6" />}
                    </button>
                  </div>
                </td>

                <td className="px-2 py-5 truncate">
                  <div className="flex flex-col truncate">
                    <span className={`text-base truncate ${isRead && !isChecked ? 'font-medium text-zinc-500' : 'font-bold text-zinc-800'}`}>
                      {doc.sender?.department || 'Departamento General'}
                    </span>
                    <span className={`text-l truncate ${isRead && !isChecked ? 'text-zinc-400' : 'text-zinc-500 font-medium'}`}>
                      {`${doc.sender?.position} - ${doc.sender?.fullName} `  || 'Usuario desconocido'}
                    </span>
                  </div>
                </td>

                <td className={`px-6 py-5 ${isRead && !isChecked ? 'text-zinc-400' : 'font-semibold text-zinc-700'}`}>
                  <div className="flex items-center gap-2">
                    {requiresSignature && <PencilSquareIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                    <span className="line-clamp-1">{doc.subject}</span>
                    {isUrgent && <span className="bg-red-100 text-red-700 text-[12px] font-bold px-2 py-0.5 rounded-md uppercase">Urgente</span>}
                  </div>
                </td>

                <td className={`px-6 py-5 ${isRead && !isChecked ? 'text-zinc-400' : 'text-zinc-500 font-medium'}`}>
                  {new Date(doc.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                </td>

                <td className="px-8 py-5 text-right">
                  <ChevronRightIcon className={`w-5 h-5 transition-colors inline ${isRead && !isChecked ? 'text-zinc-200' : 'text-zinc-300 group-hover:text-sky-600'}`} />
                </td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan="5" className="py-24 text-center text-zinc-400">
                {isLoading ? "Cargando..." : "No hay registros."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;