const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  //Receptor  
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  //El que envia
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  message: { 
    type: String, 
    required: true 
  },
  //Para iconos.
  type: { 
    type: String, 
    enum: ['info', 'warning', 'success', 'error'], 
    default: 'info' 
  },
  //Muestra el oficio directamente.
  relatedId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Oficio' 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Notification', notificationSchema);