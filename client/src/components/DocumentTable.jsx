// DocumentTable.jsx
import { 
  ChevronRightIcon, 
  ChevronLeftIcon, 
  PencilSquareIcon,
  StarIcon,
  CheckBadgeIcon
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
  currentUserId,
  trayType = 'inbox',
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <table className="w-full text-left table-fixed">
        <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-zinc-100/50">
          <tr className="border-b border-zinc-100 text-zinc-400 text-[11px] uppercase tracking-[0.1em] font-black">
            <th className="px-8 py-4 w-28"></th> 
            <th className="px-2 py-4 w-1/3">
              {trayType === 'sent' ? 'Destinatario(s)' : 'Departamento / Puesto - Remitente'}
            </th>
            <th className="px-6 py-4 w-auto">Asunto</th>
            <th className="px-6 py-4 w-72">
              <div className="flex items-center justify-between">
                <span> {trayType === 'sent' ? 'Fecha de Envío' : 'Fecha de Recepción'}</span>
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
          {currentDocuments.length > 0 ? currentDocuments.map((oficio) => {
            //Dentro del arreglo de destinatarios
            const myStatus = oficio.recipients?.find(r => r.user === currentUserId) || {};

            //Marcar como leios los oficio de sent
            const isRead = trayType === 'sent' ? true : (myStatus.seen === true); 
            const isStarred = myStatus.isStarred === true;
            const isUrgent = oficio.priority === 'Urgente';
            const requiresSignature = oficio.requiresSignature;
            const hasSigned =  myStatus.signed ? true : false;
            const isChecked = selectedIds.includes(oficio.id);

            return (
              <tr 
                key={oficio.id} 
                className={`transition group cursor-pointer border-b border-zinc-50 ${
                    isChecked ? 'bg-sky-50/50' : (isRead ? 'bg-zinc-50/80 opacity-60' : 'bg-white hover:bg-sky-50/40')
                }`}
                onClick={() => handleSelectRow(oficio.id)} 
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSelectRow(oficio.id)}
                      onClick={(e) => e.stopPropagation()} 
                      className="w-[18px] h-[18px] rounded border-zinc-300 text-sky-600 focus:ring-sky-600 cursor-pointer"
                    />
                    <button
                      onClick={(e) => toggleSingleStar(e, oficio.id, isStarred)}
                      className="text-zinc-300 hover:text-amber-400 transition transform hover:scale-110"
                    >
                      {isStarred ? <StarIconSolid className="w-6 h-6 text-amber-400" /> : <StarIcon className="w-6 h-6" />}
                    </button>
                  </div>
                </td>

                <td className="px-2 py-5 truncate">
                  <div className="flex flex-col truncate">
                    {trayType === 'sent' ? (
                      <span className='text-base truncate font-medium text-zinc-500'>
                        {oficio.recipients?.length} Destinatario(s) 
                      </span> 
                    ) :  (
                      //cambio por <>, div falla visual
                      <>
                        <span className={`text-base truncate ${isRead && !isChecked ? 'font-medium text-zinc-500' : 'font-bold text-zinc-800'}`}>
                          {oficio.sender?.department || 'Departamento General'}
                        </span>
                        <span className={`text-l truncate ${isRead && !isChecked ? 'text-zinc-400' : 'text-zinc-500 font-medium'}`}>
                         {`${oficio.sender?.position} - ${oficio.sender?.fullName} `  || 'Usuario desconocido'}
                        </span>
                      </>  
                    )}
                  </div>
                </td>

                <td className={`px-6 py-5 ${isRead && !isChecked ? 'text-zinc-400' : 'font-semibold text-zinc-700'}`}>
                  <div className="flex items-center gap-2">
                    {requiresSignature && (
                      hasSigned ? (
                        //Si esta firmado
                        <CheckBadgeIcon className="w-5 h-5 text-gray-500 flex-shrink-0" title="Oficio Firmado" />
                      ) : (
                        //Falta firma
                        <PencilSquareIcon className="w-5 h-5 text-red-500 flex-shrink-0" title="Requiere tu Firma" />
                      )  
                    )}
                    <span className="line-clamp-1">{oficio.subject}</span>
                    {isUrgent && <span className="bg-red-100 text-red-700 text-[12px] font-bold px-2 py-0.5 rounded-md uppercase">Urgente</span>}
                  </div>
                </td>
                <td className={`px-6 py-5 ${isRead && !isChecked ? 'text-zinc-400' : 'text-zinc-500 font-medium'}`}>
                  {new Date(oficio.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
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