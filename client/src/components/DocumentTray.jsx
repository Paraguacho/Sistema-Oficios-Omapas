import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import api from '../api/axios';
import DocumentToolbar from './DocumentToolbar';
import DocumentTable from './DocumentTable';
import DocumentDetailModal from './DocumentDetailModal';
import TraceabilityModal from './TraceabilityModal';

const DocumentTray = ({ fetchPath, trayType }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; 

  // Estado para el Modal
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [activeModal, setActiveModal] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id); 
      } catch (error) { console.error("Error decodificando el token:", error); }
    }
    fetchDocuments();
  }, [fetchPath]); //Recargar pagina


  //Refresh
  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(fetchPath);
      setDocuments(response.data.data);
    } catch (err) { console.error("Error fetching documents:", err);
    } finally { setIsLoading(false); }
  };


  
  const handleViewDocument = async (oficio) => {
    setSelectedDocument(oficio);

    if (trayType === 'sent') {
      setActiveModal('trace');
    } else {
      setActiveModal('read');

      const myStatus = oficio.recipients?.find(r => 
        String(r.user) === String(currentUserId)
      );
      
      if (myStatus && !myStatus.seen) {
        try {
          const targetId = oficio.id; 
          await api.put(`/oficios/${targetId}/seen`);
          
          setDocuments(prev => prev.map(d => {
            const currentId = d.id; 
            
            // Comparar id 
            return currentId === targetId ? {
              ...d,
              recipients: d.recipients.map(r => 
                String(r.user) === String(currentUserId) ? { ...r, seen: true } : r
              )
            } : d;
          }));
        } catch (err) { console.error("Error al marcar como leído:", err); }
      }
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const toggleSingleStar = async (e, id, currentStatus) => {
    e.stopPropagation(); 
    try {
      await api.put(`/oficios/${id}/star`, { status: !currentStatus });
      setDocuments(prevDocs => prevDocs.map(oficio => {
      // Si es el oficio que hay q actualizar
        if (oficio.id === id ) {
          return {
            ...oficio,
            // Entra a recipients para actualizar estado 
            recipients: oficio.recipients.map(r => {
              const recipientId = r.user;
              
              // Si el destinatario coincide actualiza estado
              if (String(recipientId) === String(currentUserId)) {
                return { ...r, isStarred: !currentStatus };
              }
              return r;
            })
          };
        }
      return oficio;
    }));
  } catch (err) {
      console.error("Error toggling star:", err);
    }
  };

  const handleBulkAction = async (actionType) => {
    try {
      setIsLoading(true);
      await Promise.all(selectedIds.map(id => {
        if (actionType === 'read') return api.put(`/oficios/${id}/seen`);
        if (actionType === 'archive') return api.put(`/oficios/${id}/archive`, { status: true });
        if (actionType === 'star') return api.put(`/oficios/${id}/star`, { status: true });
      }));
      await fetchDocuments(); 
      setSelectedIds([]); 
    } catch (error) {
      console.error(`Error with bulk action ${actionType}:`, error);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Logica filtrado paginacion 
  const filteredDocuments = documents.filter(doc => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (doc.subject || '').toLowerCase().includes(lower) || 
           (doc.sender?.department || '').toLowerCase().includes(lower) ||
           (doc.sender?.fullName || '').toLowerCase().includes(lower)
  });

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage) || 1;
  const currentDocuments = filteredDocuments.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
        <DocumentToolbar 
          selectedIds={selectedIds}
          isAllCurrentChecked={currentDocuments.length > 0 && currentDocuments.every(d => selectedIds.includes(d.id || d._id))}
          handleSelectAll={(e) => {
            const ids = currentDocuments.map(d => d.id || d._id);
            if (e.target.checked) setSelectedIds(prev => [...new Set([...prev, ...ids])]);
            else setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
          }}
          handleRefresh={fetchDocuments}
          handleBulkAction={handleBulkAction}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          trayType={trayType}
        />

        <DocumentTable 
          currentDocuments={currentDocuments}
          selectedIds={selectedIds}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          currentUserId={currentUserId}
          trayType={trayType}
          handleSelectRow={handleSelectRow}
          onViewDocument={handleViewDocument} 
          toggleSingleStar={toggleSingleStar}
          goToPreviousPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          goToNextPage={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        />

        {activeModal === 'read' && (
          <DocumentDetailModal 
            document={selectedDocument} 
            currentUserId={currentUserId}
            onClose={() => setActiveModal(null)} 
            onUpdate={(updatedOficio) => {
              const targetId = updatedOficio._id || updatedOficio.id; 
              
              setDocuments(prev => prev.map(d => {
                const currentId =  d.id; 
                return currentId === targetId ? updatedOficio : d; 
              }));
              
              setSelectedDocument(updatedOficio);
            }}
          />
        )}

        {activeModal === 'trace' && (
          <TraceabilityModal 
            document={selectedDocument} 
            onClose={() => setActiveModal(null)} 
          />
        )}

      </div>
    </div>
  );
};

export default DocumentTray;