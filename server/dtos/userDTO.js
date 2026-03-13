class userDTO{
    constructor(user){
        this.id = user.id;
        this.fullName = `${user.name} ${user.fatherName} ${user.motherName}`;
        this.name = user.name;
        this.fatherName = user.fatherName;
        this.motherName = user.motherName;
        this.username = user.username;
        this.department = user.department;
        this.position = user.position;
        this.level = user.level;
        this.isActive = user.isActive;
    }
}

module.exports = userDTO;