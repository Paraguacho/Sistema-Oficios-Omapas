import { 
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
} from '@heroicons/react/24/outline'; 

const DocumentDetailModal = ({ document, onClose }) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Cabecera del Modal */}
        <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h3 className="text-xl font-bold text-zinc-800 line-clamp-1">{document.subject}</h3>
            <p className="text-sm text-zinc-500 font-medium">Detalles del Oficio</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200/50 rounded-full transition">
            <XMarkIcon className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        {/* Contenido del Oficio */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* Datos (Remitente, Fecha, Prioridad) */}
          <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-zinc-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sky-50 rounded-lg">
                <UserIcon className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">De:</p>
                <p className="text-sm font-bold text-zinc-700">{document.sender?.fullName}</p>
                <p className="text-xs text-zinc-500">{document.sender?.department} - {document.sender.position}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">Fecha:</p>
                <p className="text-sm font-bold text-zinc-700">
                  {new Date(document.createdAt).toLocaleDateString('es-MX', { 
                    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <TagIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">Prioridad:</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                  document.priority === 'Urgente' ? 'bg-red-100 text-red-700' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {document.priority}
                </span>
              </div>
            </div>
          </div>

          {/* Cuerpo del Mensaje */}
          <div className="prose prose-zinc max-w-none">
            <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap">
              {document.message || "Este oficio no contiene un cuerpo de mensaje."}
            </p>
          </div>
        </div>

        {/* Footer (Acciones rápidas como Firmar) */}
        <div className="px-8 py-4 bg-zinc-50 border-t border-zinc-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-zinc-500 hover:text-zinc-700 transition"
          >
            Cerrar
          </button>
          {document.requiresSignature && (
            <button className="px-6 py-2.5 bg-sky-600 text-white text-sm font-bold rounded-xl hover:bg-sky-700 transition shadow-md shadow-sky-200">
              Firmar Documento
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailModal;