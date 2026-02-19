const UserDAO = require('../dataAccess/userDAO');

const getUsers = async (req,res) => {
    try {
        const users = await UserDAO.getAllUsers();
        res.status(200).json({
            data: users,
            count: users.length
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener usuarios',
            error: error.message
        })
    }
}

const getUserById = async (req,res) => {
    try {
        const users = await UserDAO.getUserById(req.params.id);
        if(!users){
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: 'Problema al obtener el usuario'});
    }
}

module.exports = {getUsers, getUserById};