import { useState } from 'react';
import api from '../api/axios';

const AdminUsers = () => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    password: '',
    department: 'Sistemas', // Valor por defecto del enum
    position: '',
    level: 3 // Por defecto Auxiliar
  });
  
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  // Definir los departamentos disponibles (debe coincidir con el enum del backend)
  const departments = [
    'Dirección General',
    'Dirección Técnica',
    'Dirección Administrativa',
    'Dirección Comercial',
    'Dirección Jurídica',
    'Órgano de Control Interno',
    'Programas Sociales',
    'Sistemas'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setCreatedUser(null);

    try {
      const response = await api.post('/users/', formData);
      
      setMessage({ type: 'success', text: 'Usuario creado exitosamente.' });
      setCreatedUser(response.data.user);
      
      // Limpiar formulario
      setFormData({
        name: '', fatherName: '', motherName: '', password: '', 
        department: 'Sistemas', position: '', level: 3
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al crear el usuario.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 bg-gray-50 overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl shadow-sm border border-zinc-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Nuevo Usuario</h2>
        
        {message && (
          <div className={`p-4 mb-6 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {createdUser && (
          <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Usuario Creado.</h3>
            <p className="text-blue-900"><strong>Nombre de usuario:</strong> {createdUser.username}</p>
            <p className="text-blue-900 text-sm mt-1">Por favor, entrega este usuario y la contraseña asignada al empleado.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
              <input 
                required 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
              <input 
                required 
                type="text" 
                name="fatherName" 
                value={formData.fatherName} 
                onChange={handleChange} 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
              <input 
                required 
                type="text" 
                name="motherName" 
                value={formData.motherName} 
                onChange={handleChange} 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección / Departamento</label>
              <select 
                required 
                name="department" 
                value={formData.department} 
                onChange={handleChange} 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="" disabled>Seleccionar departamento</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo / Puesto</label>
              <input 
                required 
                type="text" 
                name="position" 
                value={formData.position} 
                onChange={handleChange} 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Acceso</label>
              <select 
                name="level" 
                value={formData.level} 
                onChange={handleChange} 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value={0}>Nivel 0 - Administrador</option>
                <option value={1}>Nivel 1 - Dirección</option>
                <option value={2}>Nivel 2 - Gerencia</option>
                <option value={3}>Nivel 3 - Auxiliares</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Inicial</label>
              <input 
                required 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Ej. temporal123" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              disabled={isLoading} 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Registrando...' : 'Registrar Empleado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUsers;