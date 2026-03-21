const notificationDAO = require('../dataAccess/notificationDAO');
const NotificationDTO = require('../dtos/notificationDTO');

const getMyNotifications = async (req,res) =>{
    try {
        const notifications = await notificationDAO.getNotificationsByUser(req.user.id);
        const notificationDTO = notifications.map(n => new NotificationDTO(n));
        res.status(200).json({
            count: notificationDTO.length, 
            //unread count (react)
            unreadCount: notificationDTO.filter(n => !n.isRead).length,
            data: notificationDTO
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener las notificaciones',
            error: error.message
        });
    }
}

const markAsRead = async (req,res) =>{
    try {
        const updatedNotification = await notificationDAO.markAsRead(req.params.id, req.user.id);
        if (!updatedNotification){
            return res.status(404).json({
                message: 'La notificación no encontrada'
            });
        }
        res.status(200).json({
            message: 'Notificación leída',
            data: new NotificationDTO(updatedNotification)
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar la notificación',
            error: error.message
        });
    }
}

const markAllAsRead = async (req,res) => {
    try {
        await notificationDAO.markAllAsRead(req.user.id);
        res.status(200).json({
            message: 'Todas las notificaciones han sido marcadas como leídas'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error al limpiar las notificaciones',
            error: error.message
        });
    }
}


module.exports = {
    getMyNotifications,
    markAsRead,
    markAllAsRead
}