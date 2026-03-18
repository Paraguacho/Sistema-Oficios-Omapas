class GroupDTO {
    constructor(group){
        this.id = group.id;
        this.name = group.name;
        this.owner = group.owner;
        this.createdAt = group.createdAt;

        //Checar que members sea el array, no solo la id de mongo.
        if(group.members && Array.isArray(group.members)){
            this.members = group.members.map(member =>{
                //w populate from dao
                if (member && member.name){
                    return {
                        id: member.id,
                        fullName: `${member.name} ${member.fatherName}`,
                        department: member.department,
                        position: member.position
                    }
                }
                //regresar el member solo como id 
                return member
            });
        }else{
            this.members = []
        }

        this.totalMembers = this.members.length;
    }
}

module.exports = GroupDTO;