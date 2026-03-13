class oficioDTO{
    constructor(oficio){
        this.id = oficio._id;
        this.consecutive = oficio.consecutive;
        this.subject = oficio.subject;
        this.message = oficio.message;
        this.priority = oficio.priority;
        this.status = oficio.status;
        this.requiresSignature = oficio.requiresSignature;
        this.files = oficio.files;
        this.createdAt = oficio.createdAt;

        //Si el sender esta correcto 
        if (oficio.sender && oficio.sender.name){
            this.sender = {
                id: oficio.sender._id,
                fullName: `${oficio.sender.name} ${oficio.sender.fatherName}`,
                department : oficio.sender.department,
                position: oficio.sender.position
            };
        //Solo texto
        }else{
            this.sender = oficio.sender
        };

        //recipients .populate()
        if(oficio.recipients){
            this.recipients = oficio.recipients.map(r => ({
                //op ternario para comprobar si el user esta populate
                user: (r.user && r.user.name) ? {
                    id: r.user._id,
                    fullName: `${r.user.name} ${r.user.fatherName}`,
                    department: r.user.department,
                    position: r.user.position
            }: r.user,
            seen: r.seen,
            seenAt: r.seenAt,
            isStarred: r.isStarred,
            isArchived: r.isArchived,
            signed: r.signed,
            signedAt: r.signedAt,
            signatureHash: r.signatureHash
        }))}
    }
}
module.exports = oficioDTO;