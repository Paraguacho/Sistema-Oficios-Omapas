const multer = require('multer');
const path = require('path');

//Donde se guardan los archivos
const storage = multer.diskStorage({
    destination: function(req, file,cb){
        //Carpeta uploads en raiz de proyecto
        cb(null,'uploads/');
    },
    filename: function(req,file,cb){
        //Fecha actual al nombre para que sea unico
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() *  1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req,file,cb) => {
    //Permitir PDF e imagenes
    const allowedTypes = /jpeg|jpg|png|doc|docx|pdf/;
    //Comprobar si la ext es permitida
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype){
        return cb(null,true);
    } else { 
        cb (new Error('Formato no soportado. Sube solo PDF, Word o Imagen'))
    }
};

const upload = multer({
    storage: storage,
    //10MB POR ARCHIVO 
    limits: { fileSize: 10 * 1024 * 1024},
    fileFilter: fileFilter
});

module.exports = upload;
