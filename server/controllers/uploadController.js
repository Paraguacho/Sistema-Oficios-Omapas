const uploadFiles = (req,res) => {
   try {
        if(!req.files || req.files.length == 0){
            return res.status(400).json({
                message: 'No se detecto ningun archivo'
            });
        }
        //map de archivo para el dto
        const uploadFiles = req.files.map(file => ({
            url: `/uploads/${file.filename}`,
            name: file.originalname
        }));
        res.status(200).json({
            message: 'Archivos subidos exitosamente',
            files: uploadFiles
        });
   } catch (error) {
        res.status(500).json({
            message: 'Error al procesar los archivos',
            error: error.mesagge
        });
   }  
}

module.exports = {uploadFiles}