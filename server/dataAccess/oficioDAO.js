const Oficio = require('../models/Oficio');
const Counter = require('../models/Counter');

class OficioDAO {
    async createOficio(oficioData){
        try {
            //Busca el contador de oficio seq y le suma uno.
            const counter = await Counter.findByIdAndUpdate(
                'oficio_seq',
                {$inc: {seq: 1}},
                //Si no encuentra, lo crea
                {new: true, upsert : true}
            );
            //Asigna el contador al folio
            oficioData.consecutive = counter.seq;
            const nuevoOficio = await Oficio.create(oficioData);
            return nuevoOficio
        } catch (error) {
            throw error;
        }
    }

    async getInbox(userId) {
        try {
            return await Oficio.find({'recipients' : {$elemMatch: {user: userId, isArchived: false}}})
                //Inner join, a partir del sender, obtiene la informacion del usuario al que peternece
                .populate('sender', 'name fatherName department position')
                .sort({createdAt: - 1});
        } catch (error) {
            throw error;
        }
    }

    async getSentOficios(userId) {
        try {
            return await Oficio.find({sender: userId})
                .populate('recipients.user', 'name fatherName department')
                .sort({createdAt: - 1});
        } catch (error) {
            throw error;
        }
    }

    async getOficioById(id){
        try {
            return await Oficio.findById(id)
                .populate('sender', 'name fatherName department position')
                .populate('recipients.user', 'name fatherName department position')
        } catch (error) {
            throw error;
        }
    }

    async searchOficioBySubject(keyword, userId) {
        try {
            return await Oficio.find({
                //Regex para buscar la palabra, ignorando mayusculas/minusculas
                subject: {$regex: keyword, $options: 'i'},
                //El usuario es el que lo envio o el que lo recibe
                $or: [
                    {sender: userId},
                    {'recipients.user': userId}
                ]
            })
            .populate('sender', 'name fatherName department position')
            .sort({createdAt: -1});
        } catch (error) {
            throw error;
        }
    }

    async markAsSeen(oficioId, userId){
        try {
            //Busca el oficio y lo actualiza.
            return await Oficio.findOneAndUpdate(
                {_id: oficioId, 'recipients.user' : userId},
                {
                    $set: {
                        'recipients.$.seen':true,
                        'recipients.$.seenAt': new Date()
                    }
                },
                //Devolver documento actualizado
                {new: true} 
            )
        } catch (error) {
            throw error;
        }
    }

    async signOficio(oficioId, userId, signature){
        try {
            return await Oficio.findOneAndUpdate(
                {_id: oficioId, 'recipients.user': userId},
                {
                    $set: {
                        /** Como los destinatarios estan en un arreglo
                         * recipients.$.signed solo cambia el estado
                         * para el usuario que abrio el oficio.
                         */
                        'recipients.$.signed' : true,
                        'recipients.$.signedAt' : new Date(),
                        'recipients.$.signatureHash' : signature
                    }
                },
                {new : true}
            );
        } catch (error) {
            throw error;
        }        
    }


    async setStarred(oficioId, userId, status) {
        try {
            return await Oficio.findOneAndUpdate(
                {_id: oficioId, 'recipients.user':userId},
                {$set:{'recipients.$.isStarred': status}},
                {new : true}
            )
        } catch (error) {
            throw error;
        }    
    }

    async setArchived(oficioId, userId, status) {
        try {
            return await Oficio.findOneAndUpdate(
                {_id: oficioId, 'recipients.user':userId},
                {$set:{'recipients.$.isArchived': status}},
                {new : true}
            )
        } catch (error) {
            throw error;
        }    
    }

    async getStarredOficios(userId){
        try {
            return await Oficio.find({
                'recipients': {$elemMatch: {user: userId, isStarred: true}}
            })
            .populate('sender', 'name fatherName department position')
            .sort({createdAt: -1});
        } catch (error) {
            throw error;
        }
    }

    async getArchivedOficios(userId){
        try {
            return await Oficio.find({
                'recipients': {$elemMatch: {user: userId, isArchived: true}}
            })
            .populate('sender', 'name fatherName department position')
            .sort({createdAt: -1});
        } catch (error) {
            throw error;
        }
    }


}

module.exports = new OficioDAO()