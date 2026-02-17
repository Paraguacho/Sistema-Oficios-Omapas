const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    fatherName: {
        type: String,
        required: true,
        trim: true
    },
    motherName: {
        type: String,
        required: true,
        trim: true
    },
    // El ID generado: "sebastian.martinez.001"
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true 
    },
    password: {
        type: String,
        required: true
    },
    //DEPARTAMENTOS 
    department: {
        type: String,
        required: true,
        enum: [
            'Dirección General',
            'Dirección Técnica',
            'Dirección Administrativa',
            'Dirección Comercial',
            'Dirección Jurídica',
            'Órgano de Control Interno',
            'Programas Sociales',
            'Sistemas'
        ]
    },
    //Puesto
    position: {
        type: String,
        required: true 
    },
    // ADMIN > 0 , DIRECTOR > 1, GERENCIA > 2, AUX > 3. 
    level: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3], 
        default: 3
    },
    isActive: {
        type: Boolean,
        default: true 
    }
}, {
    timestamps: true
});

//Obtener el nombre completo.
//Sebastian Martinez Soqui
userSchema.virtual('fullName').get(function() {
  return `${this.name} ${this.fatherName} ${this.motherName}`;
});

module.exports = mongoose.model('User', userSchema);
