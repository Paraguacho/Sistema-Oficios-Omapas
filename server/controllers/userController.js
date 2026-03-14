const UserDAO = require('../dataAccess/userDAO');
const Counter = require('../models/Counter');
const bcrypt = require('bcryptjs')
const UserDTO = require('../dtos/userDTO');

const createUser = async (req,res) =>{
    try {
        const {name, fatherName, motherName, password, department, position, level} = req.body
        if (!name || !fatherName || !motherName || !passwpord || !department || !position){
            return res.status(400).json({
                message : 'nombre, apellido paterno, apellido materno, direccion y cargo son necesarios.'
            })
        }
        const counter = await Counter.findByIdAndUpdate(
            'user_id_seq',
            //valor de seq+=1
            {$inc: {seq:1}},
            {new : true , upsert: true}
        )
        const cleanName = name.trim().toLowerCase().split(' ')[0];
        const cleanFatherName = fatherName.trim().toLowerCase();
        // number to string, pad 4 -> 004
        const seq = String(counter.seq).padStart(3,'0');
        const userName = `${cleanName}.${cleanFatherName}.${seq}`;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userData = {
            name, fatherName, motherName, username, password: hashedPassword,
            department, position, level: level !== undefined ? level : 3
        };

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user : new UserDTO(userData)
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear el usuario',
            error : error.message
        });
    }
}

const getUsers = async (req,res) => {
    try {
        const users = await UserDAO.getAllUsers();
        const usersDTO = users.map(user => new UserDTO(user))
        res.status(200).json({
            data: usersDTO,
            count: usersDTO.length
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
        const user = await UserDAO.getUserById(req.params.id);
        if(!user){
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        res.status(200).json(new UserDTO(user));
    } catch (error) {
        res.status(500).json({
            message: 'Problema al obtener el usuario',
            error: error.message
        });
    }
}

module.exports = {createUser, getUsers, getUserById};