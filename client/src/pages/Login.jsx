import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../api/axios';

const Login = () =>{
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setErrorMessage('');
        
        try{
            //conexion con el backend
            const response = await api.post('/auth/login',{
                username: username,
                password: password
            });
            
            localStorage.setItem('token', response.data.token);
            navigate('/')
        } catch (error){
            //Server rechaza login
            if (error.response && error.response.data){
                setErrorMessage(error.response.data.message);
            }else{
                setErrorMessage('Error de conexión con el servidor')
            }
        }
    }
    return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Sistema de Oficios</h1>
          <p className="text-gray-500 mt-2">Ingresa tus credenciales para continuar</p>
        </div>
        
        {errorMessage && (
            <div className='mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative' role='alert'>
                <span className='block sm:inline'>{errorMessage}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="sebastian.martinez.001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;