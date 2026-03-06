const express = require('express');
const router = express.Router();

//Import de funcion
const {protect} = require('../middleware/authMiddleware');
const {
    createOficio,
    getInbox,
    getSent,
    getOficio,
    searchOficio,
    markAsSeen,
    signOficio,
    toggleStarred,
    toggleArchived,
    getStarred,
    getArchived
} = require('../controllers/oficioController')


//Ruta bandeja 
router.get('/inbox' , protect, getInbox);
router.get('/sent', protect, getSent);
router.get('/starred', protect, getStarred);
router.get('/archived', protect, getArchived);
router.get('/search',protect, searchOficio);
//Ruta crear
router.post('/',protect, createOficio);
//Ruta de un oficio especifico
router.get('/:id', protect, getOficio);
router.put('/:id/seen',protect, markAsSeen);
router.put('/:id/sign',protect, signOficio);
router.put('/:id/star',protect, toggleStarred);
router.put('/:id/archive', protect, toggleArchived);

module.exports = router;
