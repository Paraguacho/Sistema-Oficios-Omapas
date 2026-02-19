const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userDAO = require('../dataAccess/userDAO');

const login = async(req,res)=>{
    try {
        const {username , password} = req.body;
        const user = await userDAO.getUserByUsername(username);

        if (!user){
            return res.status(400).json({
                message:'Usuario no encontrado.'
            })
        }

        if(!user.isActive){
            return res.status(403).json({
                message: 'El usuario esta inactivo.'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({
                message: 'Contraseña incorrecta.'
            })
        }
 
        //Token
        const token = jwt.sign({
            id : user._id,
            level : user.level,
            department : user.department},   
            process.env.JWT_SECRET,
            {expiresIn: '8h'}
        );

        res.status(200).json({
            token, 
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                level : user.level
            }
        })

    } catch (error) {
        res.status(500).json({
            message: 'Error en el servidor',
            error: error.message
        })
    }
}


module.exports = {login};