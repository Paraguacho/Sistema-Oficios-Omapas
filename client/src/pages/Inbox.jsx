import { useState, useEffect } from 'react';
import api from '../api/axios';
import DocumentToolbar from '../components/DocumentToolbar';
import { jwtDecode } from 'jwt-decode'; 
import DocumentTable from '../components/DocumentTable';

const Inbox = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; 

  useEffect(() => {
    // Extrae el ID del usuario del token 
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id); // Guarda tu ID 
      } catch (error) {
        console.error("Error decodificando el token:", error);
      }
    }
    fetchDocuments();
  }, []);
  //Cada vez que busca, actualiza pag1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/oficios/inbox');
      setDocuments(response.data.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    if (!searchTerm) return true;
    
    const lowerSearch = searchTerm.toLowerCase();
    const subjectMatch = (doc.subject || '').toLowerCase().includes(lowerSearch);
    const deptMatch = (doc.sender?.department || '').toLowerCase().includes(lowerSearch);
    const nameMatch = (doc.sender?.fullName || doc.sender?.username || '').toLowerCase().includes(lowerSearch);
    
    return subjectMatch || deptMatch || nameMatch;
  });

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const goToPreviousPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  const handleRefresh = () => {
    setSelectedIds([]); 
    setSearchTerm(''); 
    fetchDocuments();
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleSelectAll = (e) => {
    const currentPageIds = currentDocuments.map(doc => doc.id);
    if (e.target.checked) {
      setSelectedIds(prev => [...new Set([...prev, ...currentPageIds])]); 
    } else {
      setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id))); 
    }
  };

  const toggleSingleStar = async (e, id, currentStatus) => {
    e.stopPropagation(); 
    try {
      await api.put(`/oficios/${id}/star`, { status: !currentStatus });
      setDocuments(prevDocs => prevDocs.map(doc => {
      // Si es el oficio que hay q actualizar
        if (doc.id === id ) {
          return {
            ...doc,
            // Entra a recipients para actualizar estado 
            recipients: doc.recipients.map(r => {
              const recipientId = r.user;
              
              // Si el destinatario coincide actualiza estado
              if (String(recipientId) === String(currentUserId)) {
                return { ...r, isStarred: !currentStatus };
              }
              return r;
            })
          };
        }
      return doc;
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

  const isAllCurrentChecked = currentDocuments.length > 0 && currentDocuments.every(doc => selectedIds.includes(doc.id));

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* LOS COMPONENTES CREADOS */}
        <DocumentToolbar 
          selectedIds={selectedIds}
          isAllCurrentChecked={isAllCurrentChecked}
          handleSelectAll={handleSelectAll}
          handleRefresh={handleRefresh}
          handleBulkAction={handleBulkAction}
          searchTerm={searchTerm}          
          setSearchTerm={setSearchTerm}   
        />

        <DocumentTable 
          currentDocuments={currentDocuments}
          selectedIds={selectedIds}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          currentUserId={currentUserId}
          handleSelectRow={handleSelectRow}
          toggleSingleStar={toggleSingleStar}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
        />
        
      </div>
    </div>
  );
};

export default Inbox;