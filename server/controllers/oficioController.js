const oficioDAO = require('../dataAccess/oficioDAO');
const userDAO = require('../dataAccess/userDAO');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Oficio = require('../models/Oficio');



//Crear oficio
const createOficio = async (req,res)=>{
    try{
        const { subject, message, priority, requiresSignature, recipientIds} = req.body;
        if(!subject || !recipientIds || recipientIds.length === 0){
            return res.status(400).json({
                message: 'El asunto y al menos un destinatario es obligatorio.'
            })
        }
        const sender = req.user.id;
        //Recipients se queda con las id de los destinatarios
        const recipients = recipientIds.map(id=>({user: id}));
        const oficioData = {sender, subject, message, priority, requiresSignature, recipients };
        const nuevoOficio = await Oficio.createOficio(oficioData);
        res.status(200).json({
            message: 'Oficio enviado correctamente'
        })
    }catch(error){
        res.status(500).json({
            message: 'Error al enviar el oficio'
        })
    }
}