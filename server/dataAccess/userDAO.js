const User = require('../models/User');

class UserDAO {
    async createUser(userData){
        try {
            const user = await User.create(userData);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserByUsername(username){
        try {
            const user = await User.findOne({username});
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers(){
        try {
            //Obtener todos los usuarios
            const users = await User.find({});
            return users;
        } catch (error) {
            throw error;
        }
    }
    
    async getUserById(id) {
        try {
            return await User.findById(id);
        } catch (error) {
            throw error;
        }        
    }

}

module.exports = new UserDAO()