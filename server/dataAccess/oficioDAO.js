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
                {returnDocument: 'after'} 
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
                {returnDocument: 'after'}
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
                {returnDocument: 'after'}
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
                {returnDocument: 'after'}
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

    async getDashboardStats(userId){
        try {
            //First day month
            const startMonth = new Date (new Date().getFullYear(), new Date().getMonth(), 1);
            //Promise para hacer las consulltas al mismo tiempo
            const [unread, pendingSignature, sentThisMonth, urgents, waitSignature ] = await Promise.all([
                //Oficios que no e visto
                Oficio.countDocuments({
                    'recipients' : {$elemMatch: {user: userId, seen: false, isArchived: false}}
                }),
                //Signature pending from user 
                Oficio.countDocuments({
                    requiresSignature: true,
                    'recipients' : {$elemMatch: {user: userId, signed: false, isArchived: false}}
                }),
                //Oficios sended by user 
                Oficio.countDocuments({
                    sender: userId,
                    createdAt: {$gte: startMonth}
                }),
                Oficio.countDocuments({
                    priority: 'Urgente',
                    'recipients': {$elemMatch: {user:userId, seen : false, isArchived: false}}
                }),
                //Enviados por mi que aun no me firman
                Oficio.countDocuments({
                    sender:userId,
                    requiresSignature: true,
                    'recipients.signed' : false
                })
            ]);

            return {
                unread,
                pendingSignature ,
                sentThisMonth,
                urgents,
                waitSignature
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new OficioDAO()