import { useState, useEffect } from 'react';
import { 
  ChevronRightIcon, 
  ChevronLeftIcon, 
  PencilSquareIcon 
} from '@heroicons/react/24/outline'; 
import api from '../api/axios';

const Inbox = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Máximo 9 oficios por página

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/oficios/inbox');
      setDocuments(response.data.data);
    } catch (err) {
      console.error("Error al cargar oficios:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Total de paginas
  const totalPages = Math.ceil(documents.length / itemsPerPage) || 1;
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = documents.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-full h-full flex flex-col">
      
      <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
        
        <div className="flex-1 overflow-y-auto">
          {/* table-fixed previene que las columnas salten de tamaño */}
          <table className="w-full text-left table-fixed">
            <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-zinc-100/50">
              <tr className="border-b border-zinc-100 text-zinc-400 text-[11px] uppercase tracking-[0.1em] font-black">
                {/* Anchos definidos para hacer las columnas rígidas */}
                <th className="px-8 py-6 w-1/3">Remitente / Departamento</th>
                <th className="px-6 py-6 w-auto">Asunto</th>
                
                <th className="px-6 py-6 w-72">
                  <div className="flex items-center justify-between">
                    <span>Fecha de Recepción</span>
                    
                    {/* Controles de paginación */}
                    <div className="flex items-center gap-1 text-zinc-400">
                      <button 
                        onClick={goToPreviousPage} 
                        disabled={currentPage === 1}
                        className="p-1 rounded hover:bg-zinc-100 hover:text-sky-600 transition disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronLeftIcon className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                      
                      {/* CONTADOR DE PAGINA */}
                      <span className="text-xs font-bold text-zinc-500 mx-1">
                        {currentPage} / {totalPages}
                      </span>
                      
                      <button 
                        onClick={goToNextPage} 
                        disabled={currentPage === totalPages}
                        className="p-1 rounded hover:bg-zinc-100 hover:text-sky-600 transition disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronRightIcon className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </th>
                <th className="px-8 py-6 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 text-sm">
              {currentDocuments.length > 0 ? currentDocuments.map((doc) => {
                
                const isRead = doc.seen || doc.status === 'Visto' || doc.read; 
                const isUrgent = doc.priority === 'Urgente' || doc.priority === 'Alta';
                const requiresSignature = doc.requiresSignature;

                return (
                  <tr 
                    key={doc.id || doc._id} 
                    className={`
                      transition group cursor-pointer border-b border-zinc-50
                      ${isRead ? 'bg-zinc-50/80 opacity-70' : 'bg-white hover:bg-sky-50/40'}
                    `}
                  >
                    <td className="px-8 py-5 truncate">
                      <div className="flex flex-col truncate">
                        <span className={`text-base truncate ${isRead ? 'font-medium text-zinc-600' : 'font-bold text-zinc-800'}`}>
                          {doc.sender?.department || 'Departamento General'}
                        </span>
                        <span className={`text-xs truncate ${isRead ? 'text-zinc-400' : 'text-zinc-500 font-medium'}`}>
                          {doc.sender?.fullName || doc.sender?.username || 'Usuario desconocido'}
                        </span>
                      </div>
                    </td>

                    <td className={`px-6 py-5 ${isRead ? 'text-zinc-500' : 'font-semibold text-zinc-700'}`}>
                      <div className="flex items-center gap-2">
                        {requiresSignature && (
                          <PencilSquareIcon className="w-5 h-5 text-gray-500 flex-shrink-0" title="Requiere Firma" />
                        )}
                        <span className="line-clamp-1">{doc.subject}</span>
                        
                        {isUrgent && (
                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex-shrink-0">
                          Urgente
                        </span>
                      )}
                      </div>
                    </td>

                    <td className={`px-6 py-5 ${isRead ? 'text-zinc-400' : 'text-zinc-500 font-medium'}`}>
                      {/* Formato de fecha */}
                      {new Date(doc.createdAt).toLocaleDateString('es-MX', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="px-8 py-5 text-right">
                      <ChevronRightIcon className={`w-5 h-5 transition-colors inline ${
                        isRead ? 'text-zinc-200' : 'text-zinc-300 group-hover:text-sky-600'
                      }`} />
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    {isLoading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-zinc-400 font-medium italic">Obteniendo correspondencia...</span>
                      </div>
                    ) : (
                      <span className="text-zinc-400 font-medium">No hay registros para mostrar en la bandeja.</span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inbox;