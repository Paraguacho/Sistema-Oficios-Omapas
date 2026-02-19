const express = require('express');
const router = express.Router();

//Import de la funcion especifica.
const {getUsers, getUserById} = require('../controllers/userController');

//Route
router.get('/', getUsers);
router.get('/:id', getUserById);

module.exports = router;