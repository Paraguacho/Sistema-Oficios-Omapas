const express = require('express');
const router = express.Router();

//Import de la funcion especifica.
const {createUser, getUsers, getUserById, getDepartments} = require('../controllers/userController');
const {authorize,protect} = require('../middleware/authMiddleware');

//Route
router.get('/', protect, getUsers);
router.get('/departments', protect, getDepartments)
router.get('/:id', protect,  getUserById);
router.post('/', protect, authorize(0), createUser);


module.exports = router;