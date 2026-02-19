const express = require('express');
const router = express.Router();

//Import de la funcion especifica.
const {login} = require('../controllers/authController');

//Route
router.post('/login', login);

module.exports = router;