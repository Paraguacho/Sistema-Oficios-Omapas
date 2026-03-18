const groupDAO = require('../dataAccess/groupDAO');
const GroupDTO = require('../dtos/groupDTO');

const createGroup = async (req,res) =>{
    try {
        const {name, members } = req.body;
        if(!name){
            return res.status(400).json({
                message: 'El nombre del grupo es obligatorio.'
            });
        }
        const groupData = {
            name,
            owner: req.user.id,
            //para crearlo vacio
            members: members || []
        };
        const newGroup = await groupDAO.createGroup(groupData);
        res.status(201).json({
            message: 'Grupo creado exitosamente',
            data: new GroupDTO(newGroup)
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear el grupo',
            error: error.message
        })        
    }
}

const getGroups = async (req,res) =>{
    try {
        const groups = await groupDAO.getGroupsByOwner(req.user.id);
        const groupsDTO = groups.map(g => new GroupDTO(g));
        res.status(200).json({
            count: groupsDTO.length,
            data: groupsDTO
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener los grupos',
            error: error.message
        })        
    }
}

const getGroupById = async (req,res) => {
    try {
        const group = await groupDAO.getGroupById(req.params.id, req.user.id);
        if(!group){
            return res.status(404).json({
                message: 'Grupo no encontrado'
            });
        }
        res.status(200).json({
            data: new GroupDTO(group)
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener el grupo',
            error: error.message
        });
    }
};

const updateGroup = async (req,res) =>{
    try {
        const {name, members} = req.body;
        const updateData = {};
        //Si esta en el body, lo agrego al obj 
        if (name) updateData.name = name;
        if (members) updateData.members = members;
        const updatedGroup = await groupDAO.updateData(req.params.id, req.user.id, updateData);
        if(!updatedGroup){
            return res.status(400).json({
                message: 'Grupo no encontrado o no tienes permiso para eliminarlo.'
            })
        }

        res.status(200).json({
            message: 'Grupo modificado exitosamente',
            data: new GroupDTO(updatedGroup)
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar el grupo',
            error: error.message
        })
    }
}

const deleteGroup = async (req,res) => {
    try {
        const deletedGroup = await groupDAO.deleteGroup(req.params.id, req.user.id)
        if(!deletedGroup){
            return res.status(404).json({
                message: 'Grupo no encontrado',
            })
        }
        res.status(200).json({
            message: 'Grupo eliminado correctamente'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar el grupo',
            error : error.message
        })
    }
}




module.exports = {
    createGroup,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup
}