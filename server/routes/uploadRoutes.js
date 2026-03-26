const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {protect} = require('../middleware/authMiddleware');
const {uploadFiles} = require('../controllers/uploadController');

//upload.array permitir 5 arhivos a la vez
router.post('/', protect , upload.array('files',5), uploadFiles);


module.exports = router;