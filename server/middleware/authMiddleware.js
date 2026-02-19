const jwt = require('jsonwebtoken');

//Verificar que el token sea real
const protect = (req,res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        //Token sin la palabra
        token = req.headers.authorization.split(' ')[1];
        //Verificar con mi jwt
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        //Guardar datos en peticion
        req.user = decoded;
        next();
    }
    if(!token){
        return res.status(401).json({
            message: 'Token no valido'
        })
    }

};

//Recibe lista de nive  les (0,1,2,3) (Admin, Direccion, Gerencia, Auxiliares )
const authorize = (...levels) =>{
    return (req,res,next) =>{
        if(!levels.includes(req.user.level)){
            return res.status(403).json({
                message: `El nivel ${req.user.level} no tiene permiso para esta accion.`
            })
            next()
        }
    }
}   

module.exports = {protect,authorize};