import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

//Confirmar que el usuario esta logueado
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

api.interceptors.response.use(
    (response) => {
        //Si funciona, regresa response
        return response;
    },
    (error) => {
        //Si el sv tira 401 
        if(error.response && error.response.status === 401){
            localStorage.removeItem('token');
            //direccion a loin
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
)

export default api;