const express = require('express');
const router = express.Router();

//Import de la funcion especifica.
const {getUsers, getUserById} = require('../controllers/userController');
const {authorize,protect} = require('../middleware/authMiddleware');

//Route
router.get('/', protect, getUsers);
router.get('/:id', protect,  getUserById);

//Ruta futura, protegida, creacion de usuario solo lo puede hacer el admin.
// router.get('/', protect, authorize(0), createUser)

module.exports = router;