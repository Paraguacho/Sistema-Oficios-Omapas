const Notification = require('../models/Notification');

class NotificationDAO {
    async createNotification(data){
        try {
            return await Notification.create(data);
        } catch (error) {
            throw error; 
        }
    }

    async getNotificationsByUser(userId){
        try {
            return await Notification.find({recipient: userId})
            .populate('sender', 'name fatherName department position')
            .sort({createdAt: -1 })//
            .limit(25);
            //Limite de 25 notificaciones
        } catch (error) {
            throw error;
        }
    }

    async markAsRead(notificationId, userId){
        try {
            return await Notification.findOneAndUpdate(
                {_id: notificationId, recipient: userId},
                {$set : {isRead: true}},
                {returnDocument: "after"}
            )
        } catch (error) {
            throw error;
        }

    }

    async markAllAsRead(userId){
        try {
            return await Notification.updateMany(
                {recipient: userId, isRead: false},
                {$set: {isRead: true}}
            );
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new NotificationDAO();