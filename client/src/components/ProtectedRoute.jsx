import {Navigate, Outlet} from 'react-router-dom';

const ProtectedRoute = ()=>{
    const token= localStorage.getItem('token');
    if(!token){
        return <Navigate to="/login" replace/>;
    }
    //Outlet renderiza las rutas hijas
    return <Outlet/>
};

export default ProtectedRoute;