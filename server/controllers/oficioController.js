const oficioDAO = require('../dataAccess/oficioDAO');
const userDAO = require('../dataAccess/userDAO');
const Oficio = require('../models/Oficio');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');



//Crear oficio
const createOficio = async (req,res)=>{
    try{
        const { subject, message, priority, requiresSignature, recipientIds, files} = req.body;
        if(!subject || !recipientIds || recipientIds.length === 0){
            return res.status(400).json({
                message: 'El asunto y al menos un destinatario es obligatorio.'
            })
        }
        const sender = req.user.id;
        //Recipients se queda con las id de los destinatarios
        const recipients = recipientIds.map(id=>({user: id}));
        const oficioData = {sender, subject, message, priority, requiresSignature, recipients , files : files || []};
        const nuevoOficio = await oficioDAO.createOficio(oficioData);
        res.status(200).json({
            message: 'Oficio enviado correctamente'
        });
    }catch(error){
        res.status(500).json({
            message: 'Error al enviar el oficio',
            error: error.message
        });
    }
};

//Bandeja de entrada
const getInbox = async (req,res)=>{
    try {
        const oficios = await oficioDAO.getInbox(req.user.id)
        res.status(200).json({
            count: oficios.length,
            data: oficios
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al cargar la bandeja de entrada',
            error : error.message
        });
    }
};

//Bandeja de salida
const getSent = async(req,res)=>{
    try {
        const oficios = await oficioDAO.getSentOficios(req.user.id);
        res.status(200).json({
            count: oficios.length,
            data: oficios
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al cargar la bandeja de enviados'
        });
    }
};

//Leer un oficio
const getOficio = async (req,res) =>{
    try {
        const oficio =  await oficioDAO.getOficioById(req.params.id);
        if (!oficio){
            return res.status(404).json({
                message: 'Oficio no encontrado'
            });
        }
        res.status(200).json({
            data: oficio
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al abrir el oficio',
            error : error.message
        });
    }
};

//Buscar por oficio
const searchOficio= async (req,res) =>{
    try {
        //Palabra para buscar
        const {q} = req.query;
        if (!q){
            return res.status(400).json({
                message: 'Ingresa un asunto para buscar'
            });
        }
        const oficios = await oficioDAO.searchOficioBySubject(q, req.user.id);
        res.status(200).json({
            count: oficios.length,
            data : oficios 
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error ',
            error : error.message
        });
    }
};

//Marcar como visto-leido
const markAsSeen = async (req,res) =>{
    try {
        const oficioUpdated = await oficioDAO.markAsSeen(req.params.id, req.user.id);
        if (!oficioUpdated){
            return res.status(404).json({
                message: 'Oficio no encontrado en la bandeja'
            });
        }
        res.status(200).json({
            message: 'Marcado como visto'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar el estado del oficio',
            error : error.message
        });
    }
};

//Firmar oficio
const signOficio = async (req,res) =>{
    try {
        const {password} = req.body;
        const userId = req.user.id;
        const oficioId = req.params.id;
        
        if(!password){
            return res.status(400).json({
                message: 'La contraseña es necesaria para firmar'
            })
        } 
        //Verificar password
        const user = await userDAO.getUserById(userId);
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(401).json({
                message: 'Contraseña incorrecta, intenta de nuevo'
            });
        }
        const dataToHash = `${oficioId}-${userId}-${new Date().toISOString()}-${process.env.JWT_SECRET}`;
        const signatureHash = crypto.createHash('sha256').update(dataToHash).digest('hex');
        //Guardar bd
        const signatedOficio = await oficioDAO.signOficio(oficioId,userId, signatureHash);
        res.status(200).json({
            message: 'Oficio firmado exitosamente',
            signature: signatureHash
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al firmar el oficio',
            error : error.message
        });
    }
};

//Destacar-quitar destacadO
const toggleStarred = async (req,res) =>{
    try {
        const {status} = req.body;
        await oficioDAO.setStarred(req.params.id, req.user.id, status);
        res.status(200).json({
            message: status ? 'Añadiendo a destacados' : 'Quitando de destacados'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al destacar el oficio',
            error: error.message
        })
    }
}

//Archivar - desarchivar
const toggleArchived = async (req,res) =>{
    try {
        const {status} = req.body;
        await oficioDAO.setArchived(req.params.id, req.user.id, status);
        res.status(200).json({
            message: status ? 'Oficio archivado ' : 'Oficio desarchivado'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro al archivar el oficio',
            error: error.message
        });
    }
}

//Obtener destacados
const getStarred = async (req,res) =>{
    try {
        const oficios = await oficioDAO.getStarredOficios(req.user.id);
        res.status(200).json({
            count: oficios.length,
            data: oficios
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al cargar destacados',
            error: error.message
        });
    }
};

const getArchived = async (req,res) =>{
    try {
        const oficios = await oficioDAO.getArchivedOficios(req.user.id)
        res.status(200).json({
            count: oficios.length,
            data: oficios
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error al cargar archivados',
            error : error.message
        })
    }
};

module.exports = {
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
}