import { useState } from 'react';
import { 
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import {CheckBadgeIcon} from '@heroicons/react/24/solid'; 
import api from '../api/axios';

const DocumentDetailModal = ({ document: oficio, onClose, currentUserId, onUpdate }) => {
  const [isSigning, setIsSigning] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  if (!oficio) return null;

  const myStatus = oficio.recipients?.find(r => {
    const recipientId = r.user
    return String (recipientId).trim() === String(currentUserId).trim();
  });
  const isRecipient = !!myStatus;
  //Yo ya firme
  const hasSigned = !!myStatus?.signed
  const handleSign = async (e) => {
    e.preventDefault();
    if(!password.trim()) return alert('Debes ingresar tu contraseña para firmar. ');
    try {
      setIsSigning(true);
      await api.put(`/oficios/${oficio.id}/sign`, {password});
      const updatedOficio = {
        ...oficio,
        recipients: oficio.recipients.map(r => 
          String(r.user) === String(currentUserId)
          ? {...r, signature: "Firmado"} : r
        )
      };
      onUpdate(updatedOficio)
      setShowPasswordPrompt(false); 
      setPassword('')

    }catch (error) {
      console.error("Error al firmar el documento:",error);
      alert(error.response.data.message || "Error al firmar. Verifica la contraseña");
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Cabecera del Modal */}
        <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h3 className="text-xl font-bold text-zinc-800 line-clamp-1">{oficio.subject}</h3>
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
                <p className="text-sm font-bold text-zinc-700">{oficio.sender?.fullName}</p>
                <p className="text-xs text-zinc-500">{oficio.sender?.department} - {oficio.sender.position}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">Fecha:</p>
                <p className="text-sm font-bold text-zinc-700">
                  {new Date(oficio.createdAt).toLocaleDateString('es-MX', { 
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
                  oficio.priority === 'Urgente' ? 'bg-red-100 text-red-700' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {oficio.priority}
                </span>
              </div>
            </div>
          </div>

          {/* Cuerpo del Mensaje */}
          <div className="prose prose-zinc max-w-none">
            <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap">
              {oficio.message || "Este oficio no contiene un cuerpo de mensaje."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-4">
          
          {/* Si NO estamos pidiendo contraseña, mostramos el botón de Cerrar */}
          {!showPasswordPrompt && (
            <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-zinc-500 hover:text-zinc-700 transition">
              Cerrar
            </button>
          )}
          
          {oficio.requiresSignature && isRecipient && (
            hasSigned ? (
              <div className="flex items-center gap-2 px-6 py-2.5 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl border border-emerald-200">
                <CheckBadgeIcon className="w-5 h-5" />
                Documento Firmado
              </div>
            ) : showPasswordPrompt ? (
              // FORMULARIO INLINE PARA LA CONTRASEÑA
              <form onSubmit={handleSign} className="flex items-center gap-3 w-full justify-end animate-fade-in">
                <div className="relative">
                  <LockClosedIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="password"
                    placeholder="Confirma tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    className="pl-9 pr-4 py-2 border border-zinc-300 rounded-xl text-sm font-medium text-zinc-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition w-56"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowPasswordPrompt(false)} 
                  className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-700 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSigning || !password}
                  className="px-6 py-2.5 bg-sky-600 text-white text-sm font-bold rounded-xl hover:bg-sky-700 transition shadow-md shadow-sky-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSigning ? 'Verificando...' : 'Confirmar Firma'}
                </button>
              </form>
            ) : (
              // BOTÓN INICIAL QUE DESPLIEGA EL CAMPO DE CONTRASEÑA
              <button 
                onClick={() => setShowPasswordPrompt(true)}
                className="px-6 py-2.5 bg-sky-600 text-white text-sm font-bold rounded-xl hover:bg-sky-700 transition shadow-md shadow-sky-200"
              >
                Firmar Documento
              </button>
            )
          )}
        
        </div>
      </div>
    </div>
  );
};


export default DocumentDetailModal;