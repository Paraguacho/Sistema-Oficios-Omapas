import { 
  ArchiveBoxIcon,
  EnvelopeOpenIcon,
  ArrowPathIcon,
  StarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'; 

const DocumentToolbar = ({ 
  selectedIds, 
  isAllCurrentChecked, 
  handleSelectAll, 
  handleRefresh, 
  searchTerm,
  setSearchTerm,
  handleBulkAction 
}) => {
  return (
    <div className="flex items-center px-8 py-3 border-b border-zinc-100 bg-zinc-50/40 gap-4 shrink-0 transition-all min-h-[56px]">

      
      
      {/* Controles Fijos */}
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={isAllCurrentChecked}
          onChange={handleSelectAll}
          className="w-[18px] h-[18px] rounded border-zinc-300 text-sky-600 focus:ring-sky-600 cursor-pointer"
        />
        <button
          onClick={handleRefresh}
          className="p-1.5 text-zinc-500 hover:bg-white hover:shadow-sm hover:text-sky-600 rounded-lg transition border border-transparent hover:border-zinc-200"
          title="Actualizar Bandeja"
        >
          <ArrowPathIcon className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      

      {/* Controles para los seleccionados */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 border-l border-zinc-300 pl-4 text-zinc-600 transition-all">
          <button 
            onClick={() => handleBulkAction('read')} 
            className="p-1.5 hover:bg-white hover:shadow-sm hover:text-sky-600 rounded-lg transition border border-transparent hover:border-zinc-200" 
            title="Marcar como leído"
          >
            <EnvelopeOpenIcon className="w-5 h-5" strokeWidth={2} />
          </button>
          
          <button 
            onClick={() => handleBulkAction('archive')} 
            className="p-1.5 hover:bg-white hover:shadow-sm hover:text-sky-600 rounded-lg transition border border-transparent hover:border-zinc-200" 
            title="Archivar seleccionados"
          >
            <ArchiveBoxIcon className="w-5 h-5" strokeWidth={2} />
          </button>
          
          <button 
            onClick={() => handleBulkAction('star')} 
            className="p-1.5 hover:bg-white hover:shadow-sm hover:text-amber-500 rounded-lg transition border border-transparent hover:border-zinc-200" 
            title="Destacar seleccionados"
          >
            <StarIcon className="w-5 h-5" strokeWidth={2} />
          </button>
          
          <span className="text-xs font-bold text-zinc-400 ml-3 bg-white px-2 py-1 rounded-md border border-zinc-200">
            {selectedIds.length} seleccionado{selectedIds.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      <div className="relative w-full max-w-2xl">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Buscar por asunto, departamento o remitente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition shadow-sm"
        />
      </div>  
    </div>
  );
};

export default DocumentToolbar;