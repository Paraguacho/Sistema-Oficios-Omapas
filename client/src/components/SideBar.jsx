import { Link, useNavigate, useLocation} from 'react-router-dom';
import {
    HomeIcon,
    InboxIcon,
    PaperAirplaneIcon,
    StarIcon,
    ArrowLeftOnRectangleIcon,
    ArchiveBoxIcon,
    PencilSquareIcon,
    Cog6ToothIcon,
    Squares2X2Icon
} from '@heroicons/react/24/outline';

const Sidebar = () =>{
    const navigate = useNavigate();
    //Resaltar 
    const location = useLocation();
    const handleLogout = () =>{
        localStorage.removeItem('token');
        navigate('/login');
    };


//Botones clases
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

        {/* Nav */}
        <nav className='flex-1 space-y-2'>
            <Link to='/inbox' className={navItemClass('/inbox')}>
                <InboxIcon className='w-6 h-6'/>
                Bandeja de Entrada
            </Link>

            <Link to='/sent' className={navItemClass('/sent')}>
                <PaperAirplaneIcon className='w-6 h-6'/>
                Enviados
            </Link>

            <Link to='/starred' className={navItemClass('/starred')}>
                <StarIcon className='w-6 h-6'/>
                Descatados
            </Link>
            
            <Link to='/archived' className={navItemClass('/archived')}>
                <ArchiveBoxIcon className='w-6 h-6'/>
                Archivados
            </Link>

            <Link to='/signed' className={navItemClass('/signed')}>
                <PencilSquareIcon className='w-6 h-6'/>
                Firmados
            </Link>

            <Link to='/archived' className={navItemClass('/archived')}>
                <Squares2X2Icon className='w-6 h-6'/>
                Panel Trazabilidad
            </Link>

            <Link to='/archived' className={navItemClass('/archived')}>
                <Cog6ToothIcon className='w-6 h-6'/>
                Configuracion
            </Link>

            
            
            
            
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