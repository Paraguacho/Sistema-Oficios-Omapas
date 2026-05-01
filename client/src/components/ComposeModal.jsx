import { useState, useEffect } from "react";
import { XMarkIcon, PaperAirplaneIcon, UsersIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import api from '../api/axios';

const ComposeModal = ({onClose, onSuccess}) =>{
    const [users, setUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [isSending, setIsSending] = useState(false);

    //Estado del form 
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState('Normal');
    const [requiresSignature, setRequiresSignature] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                //El axios me manda data en la response y en el dao tmb lo guardo como data 
                const users = response.data.data
                setUsers(users)
            } catch (error) {
                console.error('Error al cargar usuarios: ', error);
           } finally{
            setIsLoadingUsers(false);
           }
        };
    fetchUsers();   
    }, []);

    const toggleUserSelection = (userId) => {
        setSelectedUsers ( prev => 
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev , userId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject || selectedUsers.length === 0) return alert("Asunto y Destinatarios son obligatorios");
        
        try{ 
            setIsSending(true);
            await api.post('/oficios' , {
                subject,
                message,
                priority,
                requiresSignature,
                recipientIds: selectedUsers
            });
            //Cerrar modal
            onSuccess();
        } catch (error) {
            console.error("Error al enviar el oficio: ",error);
            alert("Algo fallo al enviar el envio");
        } finally {
            setIsSending(false);
        }
    };

    const filteredUsers = users.filter( user => {
      if (!userSearchTerm) return true;
      const searchLower = userSearchTerm.toLowerCase();
      return (
        (user.fullName || '').toLowerCase().includes(searchLower) || 
        (user.department || '').toLowerCase().includes(searchLower) || 
        (user.position || '').toLowerCase().includes(searchLower) 
      );
    });

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Encabezado */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <h3 className="text-lg font-bold text-zinc-800">Nuevo Oficio</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200/50 rounded-full transition">
            <XMarkIcon className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 gap-5 overflow-hidden">
          
          {/* Selección de Destinatarios */}
          <div className="flex flex-col gap-2 shrink-0">
            <label className="text-xs uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-2">
              <UsersIcon className="w-4 h-4" /> Para:
            </label>
            {/* Campo de busqueda */}
            <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre, depto o puesto..." 
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1 text-sm border border-zinc-200 rounded-lg focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none w-64 md:w-80 transition bg-zinc-50 focus:bg-white"
                />
            </div>

            <div className="border border-zinc-200 rounded-xl max-h-32 overflow-y-auto p-2 bg-zinc-50/30">
              {isLoadingUsers ? (
                <p className="text-sm text-zinc-400 p-2">Cargando directorio...</p>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <label key={user.id} className="flex items-center gap-3 p-2 hover:bg-sky-50 rounded-lg cursor-pointer transition">
                    <input 
                      type="checkbox" 
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-600 border-zinc-300"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-700">{user.fullName }</span>
                      <span className="text-xs text-zinc-500">{user.department || 'Sin departamento'} {user.position ? ` - ${user.position}` : ''}</span>
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-sm text-zinc-400 p-2 text-center italic"> No se encontraron usuarios que coincidan con la búsqueda. </p>
              )}
            </div>

            <span className="text-xs text-sky-600 font-medium ml-1">
              {selectedUsers.length} destinatario(s) seleccionado(s)
            </span>
          </div>

          {/* Asunto */}
          <div className="shrink-0">
            <input 
              type="text" 
              placeholder="Asunto del oficio" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full text-lg font-bold text-zinc-800 placeholder-zinc-300 border-b-2 border-transparent hover:border-zinc-200 focus:border-sky-500 bg-transparent py-2 outline-none transition"
            />
          </div>

          {/* Opciones (Prioridad y Firma) */}
          <div className="flex items-center gap-6 py-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-500">Prioridad:</span>
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
                className="bg-zinc-100 text-zinc-700 text-sm font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-sky-500 border-none cursor-pointer"
              >
                <option value="Normal">Normal</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={requiresSignature}
                onChange={(e) => setRequiresSignature(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-600 border-zinc-300"
              />
              <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-800 transition">
                Requiere Firma Electrónica
              </span>
            </label>
          </div>

          {/* Cuerpo del Mensaje */}
          <div className="flex-1 flex flex-col min-h-0 mt-2">
            <textarea 
              placeholder="Redacta el cuerpo del oficio aquí..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-full resize-none outline-none text-zinc-700 placeholder-zinc-300 bg-transparent py-2 leading-relaxed"
            ></textarea>
          </div>
        </form>

        {/* Footer (Botón Enviar) */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-zinc-500 hover:bg-zinc-200/50 rounded-xl transition">
            Cancelar
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSending || selectedUsers.length === 0 || !subject}
            className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 text-white text-sm font-bold rounded-xl hover:bg-sky-700 transition shadow-md shadow-sky-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
            {isSending ? 'Enviando...' : 'Enviar Oficio'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ComposeModal;

