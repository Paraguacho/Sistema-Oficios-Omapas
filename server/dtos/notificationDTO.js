class NotificationDTO{
    constructor(notification){
        this.id = notification.id;
        this.message = notification.message;
        this.type = notification.type;
        this.relatedId = notification.relatedId;
        this.isRead = notification.isRead;
        this.createdAt = notification.createdAt;

        if (notification.sender && notification.sender.name){
            this.sender = {
                id : notification.sender._id,
                fullName: `${notification.sender.name} ${notification.sender.fatherName}`,
                department: notification.sender.department,
                position: notification.sender.position 
            }
        } else {
            //Notification without sender like from system or else
            this.sender = notification.sender || null;
        }
    }
}

module.exports = NotificationDTO;