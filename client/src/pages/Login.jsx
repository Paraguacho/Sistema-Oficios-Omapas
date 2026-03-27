import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../api/axios';

//Icons
import {UserCircleIcon, LockClosedIcon} from '@heroicons/react/24/outline';
import {ExclamationTriangleIcon} from '@heroicons/react/24/solid';

const Login = () =>{
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState('');

    const navigate = useNavigate();
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);
        
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
        } finally {
            setLoading(false);
        }
    }
    return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 p-6">
      {/*¨bg sky 100 o bg blue 100 */}
      {/*TARJETA*/}
      <div className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-xl shadow-sky-950/5 border border-zinc-100">
        
        {/*LOGO PLACEHOLDER*/}
        <div className="text-center mb-10">
          
          {/* Espacio para el logo oficial de OOMAPAS */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-sky-600 rounded-full flex items-center justify-center shadow-lg shadow-sky-600/30">
              <img src="/src/assets/logo-oomapas.png" alt="OOMAPAS Logo" className="w-20 h-auto object-contain mx-auto" /> 
              
            </div>
          </div>
          
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Sistema de Oficios</h1>
          <p className="text-lg text-zinc-500 mt-2">Bienvenido. Ingresa para continuar.</p>
        </div>

        {/*ALERTA ERROR*/}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-center font-medium flex items-center gap-3 justify-center">
             <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
             {errorMessage}
          </div>
        )}

        {/*FORMULARIO*/}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/*USUARIO*/}
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-zinc-400 group-focus-within:text-sky-600">
              {/*Outline*/}
              <UserCircleIcon className="w-7 h-7 text-zinc-400 group-focus-within:text-sky-600 transition" />
            </span>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-16 pr-4 py-4 text-lg border border-zinc-200 rounded-2xl bg-zinc-50 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-300 outline-none transition duration-150"
              placeholder="Ej. sebastian.martinez.001" 
              required
            />
          </div>

          {/*Contraseña*/}
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-zinc-400 group-focus-within:text-sky-600">
              {/*Outline*/}
              <LockClosedIcon className="w-7 h-7 text-zinc-400 group-focus-within:text-sky-600 transition" />
            </span>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-16 pr-4 py-4 text-lg border border-zinc-200 rounded-2xl bg-zinc-50 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-300 outline-none transition duration-150"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="text-center">
             <a href="#" className="text-sky-700 hover:text-sky-800 hover:underline font-medium">
               ¿Olvidaste tu contraseña?
             </a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-sky-600 text-white text-xl py-4 rounded-xl hover:bg-sky-700 transition duration-150 font-bold shadow-lg shadow-sky-600/30 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? 'Iniciando Sesión...' : 'Ingresar al Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;