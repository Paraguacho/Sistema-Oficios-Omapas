import { useState } from 'react';
import { XMarkIcon, EyeIcon, PencilSquareIcon, UsersIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

const TraceabilityModal = ({ document: oficio, onClose }) => {

    const [expandedRecipients, setExpandedRecipients] = useState({});

  if (!oficio) return null;

  const recipients = oficio.recipients;
  const totalRecipients = recipients.length;
  
  const viewedRecipients = recipients.filter(r => r.seen).length;
  const signedRecipients = oficio.requiresSignature 
    ? recipients.filter(r => r.signed).length 
    : 0;
  const pendingSignature = oficio.requiresSignature 
    ? recipients.filter(r => !r.signed).length 
    : 0;

  const formatDate = (dateString) => {
    if (!dateString) return 'Pendiente';
    return new Date(dateString).toLocaleDateString('es-MX', {
      hour: '2-digit', minute: '2-digit',
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    });
  };
  // DESTINATARIO >
  const toggleRecipient = (recipientId) => {
    setExpandedRecipients(prev => ({
      ...prev,
      [recipientId]: !prev[recipientId]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Cabecera del Modal */}
        <div className="px-8 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 shrink-0">
          <div>
            <p className="text-xs text-zinc-500 font-medium">Panel de Trazabilidad</p>
            <h3 className="text-xl font-bold text-zinc-800 line-clamp-1">{oficio.subject}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200/50 rounded-full transition">
            <XMarkIcon className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
            {/* Oficio enviado */}
            <div className="bg-zinc-100 border border-zinc-200 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-white rounded-full text-zinc-600 shadow-sm"><UsersIcon className="w-6 h-6" /></div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Enviado a:</p>
                <p className="text-2xl font-black text-zinc-900">{totalRecipients}</p>
                <p className="text-xs text-zinc-600">receptores</p>
              </div>
            </div>

            {/* Visualizado */}
            <div className="bg-sky-50 border border-sky-100 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-white rounded-full text-sky-600 shadow-sm"><EyeIcon className="w-6 h-6" /></div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-sky-600">Visualizado por:</p>
                <p className="text-2xl font-black text-sky-900">{viewedRecipients}</p>
                <p className="text-xs text-zinc-600">Receptores</p>
              </div>
            </div>

            {/* Firmado */}
            {oficio.requiresSignature && (
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-center gap-4 animate-fade-in">
                <div className="p-3 bg-white rounded-full text-emerald-600 shadow-sm"><CheckBadgeIcon className="w-6 h-6" /></div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-bold text-emerald-600">Firmado:</p>
                  <p className="text-2xl font-black text-zinc-900">{signedRecipients}</p>
                  <p className="text-xs text-zinc-600">Receptores</p>
                </div>
              </div>
            )}

            {/* Pendientes */}
            {oficio.requiresSignature && (
              <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex items-center gap-4 animate-fade-in">
                <div className="p-3 bg-white rounded-full text-amber-600 shadow-sm"><PencilSquareIcon className="w-6 h-6" /></div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-bold text-amber-600">Pendientes de Firma:</p>
                  <p className="text-2xl font-black text-zinc-900">{pendingSignature}</p>
                  <p className="text-xs text-zinc-600">Receptores</p>
                </div>
              </div>
            )}
          </div>

          {/* Listado */}
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            <div className="flex items-center justify-between px-3 shrink-0">
                <h4 className="text-sm font-bold text-zinc-600">Receptores de este Oficio ({totalRecipients})</h4>
                <p className="text-xs text-zinc-400 font-medium">Estatus Actual</p>
            </div>

            {/* Contenedor */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 min-h-0 border-t border-zinc-100 pt-3">
              {recipients.map(rec => {
                const recId =  rec.user;
                const isExpanded = expandedRecipients[recId];
                
                
                const isRead = rec.seen;
                const isSigned = rec.signed; 

                return (
                  <div key={recId} className={`bg-zinc-50 border rounded-2xl transition ${isExpanded ? 'border-sky-100 bg-sky-50/20' : 'border-zinc-100'}`}>
                    
                    <button 
                        onClick={() => toggleRecipient(recId)}
                        className="w-full flex items-center justify-between p-5 gap-4 text-left"
                    >
                      <div>
                        <p className="text-sm font-bold text-zinc-800">{rec.user?.fullName || 'Cargando...'}</p>
                        <p className="text-xs text-zinc-500">{rec.user?.department || 'Departamento'}</p>
                      </div>

                      {/* Estatus recibido abierto */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs font-semibold">
                            <span className="text-emerald-600">Recibido</span>
                            <span className="text-zinc-300">››</span>
                            
                            {/* Estatus: Abierto */}
                            <span className={`${isRead ? 'text-sky-600' : 'text-zinc-400 opacity-60'}`}>Abierto</span>
                            <span className="text-zinc-300">››</span>
                            
                            {/* Estatus: Firmado */}
                            {oficio.requiresSignature && (
                                <span className={`${isSigned ? 'text-emerald-600' : 'text-zinc-400 opacity-60'}`}>Firmado</span>
                            )}
                        </div>
                        {isExpanded ? <ChevronUpIcon className="w-5 h-5 text-zinc-400" /> : <ChevronDownIcon className="w-5 h-5 text-zinc-400" />}
                      </div>
                    </button>

                    {/* Contenido expandido */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-sky-100/50 animate-slide-down">
                        <div className="grid grid-cols-2 gap-4 text-xs bg-white p-4 rounded-lg border border-sky-100">
                          <div>
                            <p className="font-medium text-zinc-500">Oficio Recibido:</p>
                            <p className="font-bold text-zinc-700">{formatDate(oficio.createdAt)}</p>
                          </div>
                          <div>
                            <p className="font-medium text-zinc-500">Oficio Visualizado:</p>
                            <p className={`font-bold ${isRead ? 'text-sky-700' : 'text-zinc-400 italic'}`}>
                                {isRead ? formatDate(rec.seenAt) : 'No visualizado aún'}
                            </p>
                          </div>
                          {oficio.requiresSignature && (
                            <div className="col-span-2 mt-2 pt-2 border-t border-zinc-100">
                              <p className="font-medium text-zinc-500">Oficio Firmado:</p>
                              <p className={`font-bold ${isSigned ? 'text-emerald-700' : 'text-zinc-400 italic'}`}>
                                  {isSigned ? formatDate(rec.signedAt) : 'No firmado aún'}
                              </p>
                              {isSigned && (
                                <p className="text-[10px] text-zinc-400 font-mono mt-1 truncate">Firma Hash: {rec.signatureHash}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer (shrink-0) */}
        <div className="px-8 py-4 bg-zinc-50 border-t border-zinc-100 flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-950 text-white text-sm font-bold rounded-xl transition shadow-md shadow-zinc-200">
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraceabilityModal;