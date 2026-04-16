import { 
  ArchiveBoxIcon,
  EnvelopeOpenIcon,
  ArrowPathIcon,
  StarIcon
} from '@heroicons/react/24/outline'; 

const DocumentToolbar = ({ 
  selectedIds, 
  isAllCurrentChecked, 
  handleSelectAll, 
  handleRefresh, 
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

      {/* Controles Dinámicos (Solo aparecen si hay seleccionados) */}
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
    </div>
  );
};

export default DocumentToolbar;