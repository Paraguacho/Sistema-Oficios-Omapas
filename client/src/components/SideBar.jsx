import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
    HomeIcon,
    InboxIcon,
    PaperAirplaneIcon,
    StarIcon,
    ArrowLeftOnRectangleIcon,
    ArchiveBoxIcon,
    PencilSquareIcon,
    Cog6ToothIcon,
    Squares2X2Icon, 
} from '@heroicons/react/24/outline';

const Sidebar = ({ onOpenCompose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userLevel, setUserLevel] = useState(null);

    useEffect(() => {
        // Obtener y decodificar el token al cargar el componente
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("TOKEN: ", decoded)
                setUserLevel(decoded.level);
            } catch (error) {
                console.error("Error decodificando el token:", error);
                setUserLevel(null);
            }
        }
    }, []); // Solo se ejecuta una vez al montar el componente

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItemClass = (path) => `
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
        ${location.pathname === path 
            ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20' 
            : 'text-zinc-500 hover:bg-sky-50 hover:text-sky-700'}
    `;

    return (
        <aside className='w-72 bg-white border-r border-zinc-200 flex flex-col p-6 h-screen sticky top-0'>
            {/* Logo */}
            <div className='flex items-center gap-3 mb-12 px-2'>
                <img src='/src/assets/logoSidebar.png' alt='OOMAPAS' className='rounded-full w-10 h-auto'/>
                <h1 className='text-xl font-bold text-zinc-900 leading-tight tracking-tight'>OOMAPAS</h1>
            </div>

            <div className='p-6 pb-2'>
                <button
                    onClick={onOpenCompose}
                    className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-sky-200 transition transform hover:-translate-y-0.5"
                >
                    <PencilSquareIcon className='w-5 h-5' strokeWidth={2.5} />
                    Redactar
                </button>
            </div>

            {/* Nav */}
            <nav className='flex-1 space-y-2'>
                <Link to='/inbox' className={navItemClass('/inbox')}>
                    <InboxIcon className='w-6 h-6'/>
                    Bandeja de Entrada
                </Link>

                <Link to='/sent' className={navItemClass('/sent')}>
                    <PaperAirplaneIcon className='w-6 h-6'/>
                    Enviados (Trazabilidad)
                </Link>

                <Link to='/starred' className={navItemClass('/starred')}>
                    <StarIcon className='w-6 h-6'/>
                    Destacados
                </Link>
                
                <Link to='/archived' className={navItemClass('/archived')}>
                    <ArchiveBoxIcon className='w-6 h-6'/>
                    Archivados
                </Link>

                <Link to='/signed' className={navItemClass('/signed')}>
                    <PencilSquareIcon className='w-6 h-6'/>
                    Firmados
                </Link>

                {/* Solo mostrar sección de admin si userLevel es 0 */}
                {userLevel === 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl transition text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="font-medium">Gestión de Usuarios</span>
                        </Link>
                    </div>
                )}
            </nav>
            
            {/* Cerrar Sesion */}
            <button
                onClick={handleLogout}
                className='mt-auto flex items-center gap-3 px-4 py-3 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors cursor-pointer'
            >
                <ArrowLeftOnRectangleIcon className='w-6 h-6'/>
                Cerrar Sesión
            </button>
        </aside>
    );
};

export default Sidebar;