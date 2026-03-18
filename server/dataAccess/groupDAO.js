const Group = require('../models/Group');

class GroupDAO{
    async createGroup (groupData){
        try {
            return await Group.create(groupData);
        } catch (error) {
            throw error;
        }
    }

    async getGroupsByOwner(userId){
        try {
            return await Group.find({owner: userId})
            .populate('members' , 'name fatherName department position') //members como es array, con el populate obtengo los datos d cada member
            .sort({createdAt: -1});//El nuevo primero
        } catch (error) {
            throw error;
        }
    }

    async getGroupById(groupId, userId){
        try {
            return await Group.findOne({_id: groupId, owner:userId})
            .populate('members' , 'name fatherName department position');
        } catch (error) {
            throw error;
        }
    }

    async updateData(groupId, userId, updateData){
        try {
            return await Group.findByIdAndUpdate(
                {_id: groupId, owner: userId, },
                updateData,
                {returnDocument: after}
            ).populate('members', 'name fatherName department position');
        } catch (error) {
            throw error;             
        }
    }

    async deleteGroup(groupId, userId) {
        try {
            return await Group.findOneAndDelete({_id: groupId , owner: userId });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new GroupDAO()