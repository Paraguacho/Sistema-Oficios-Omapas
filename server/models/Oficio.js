const mongoose = require('mongoose');

const recipientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Relación con la colección de Usuarios
        required: true
    },
    // Estado de Lectura
    seen: {
        type: Boolean,
        default: false
    },
    seenAt: {
        type: Date, // Fecha exacta de cuando abrió el oficio
        default: null
    },
    //Favorito
    isStarred: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    // Firma 
    signed: {
        type: Boolean,
        default: false
    },
    signedAt: {
        type: Date
    },
    signatureHash: {
        type: String
    }
}, { _id: false });

const oficioSchema = new mongoose.Schema({
    consecutive: {
        type: Number,
        required: true,
        unique: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    priority: {
        type: String,
        enum: ['Normal', 'Urgente'],
        default: 'Normal'
    },
    status: {
        type: String,
        enum: ['Borrador', 'Enviado'],
        default: 'Borrador'
    },
    requiresSignature: {
        type: Boolean,
        default: false // Define si el botón "Firmar" aparece o solo es informativo
    },
    files: [{
        url: String, // Ruta del archivo 
        name: String
    }],

    // Un arreglo con todos los destinatarios y sus estados
    recipients: [recipientSchema]
}, {
    timestamps: true
});

//oficios sin leer
oficioSchema.index({'recipients.user' : 1, 'recipients.seen' : 1, 'recipients.isArchived' : 1 });
//oficios que requieren firma
oficioSchema.index({'recipients.user': 1, 'recipients.signed': 1, requiresSignature: 1});
//oficio que el user envio este mes 
oficioSchema.index({sender: 1, createdAt: -1});
//oficios urgentes
oficioSchema.index({'recipients.user': 1 , priority: 1 , 'recipients.seen': 1});
//oficio que el user envio y aun faltan de firmar
oficioSchema.index({sender:1,requiresSignature:1,'recipients.signed':1});


module.exports = mongoose.model('Oficio', oficioSchema);
