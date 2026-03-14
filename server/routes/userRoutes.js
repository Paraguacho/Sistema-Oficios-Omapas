const express = require('express');
const router = express.Router();

//Import de la funcion especifica.
const {createUser,getUsers, getUserById} = require('../controllers/userController');
const {authorize,protect} = require('../middleware/authMiddleware');

//Route
router.get('/', protect, getUsers);
router.get('/:id', protect,  getUserById);
router.post('/', protect, authorize(0), createUser);


module.exports = router;