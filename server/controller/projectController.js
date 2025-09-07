const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const getAllProject = async (req, res) => {
    try {
        const foundUser = await User.findOne({ username: req.user }).exec();
        if (!foundUser) return res.sendStatus(401); //Unauthorized

        const userId = foundUser._id;

        const projects = await Project.find({
            $or: [
                {owner: userId},
                {members: userId}
            ]
        }).exec(); //can use lean

        if(projects.length === 0) return res.status(204).json({message: "No projects created"});
        res.json(projects)
    }
    catch (err) {
        res.status(500).json( {message : err.message});
    }
}

const createNewProject = async (req, res) => {
    const { title, members = []} = req.body;

    if(!title) title = 'New Page';
    const trimmedTitle = title.trim();

    try {
        const foundUser = await User.findOne({username: req.user}).exec();
        if(!foundUser) return res.sendStatus(401); //Unauthorized

        const ownerId = foundUser._id;

        const project = new Project({
            title: trimmedTitle,    
            owner: ownerId,
            members: [... new Set([ownerId, ...members])]
        });

        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } 
    catch(err) {
        res.status(500).json({message: err.message});
    }
}

const deleteProject = async (req, res) => {
    const { projectId } = req.params;
    if(!projectId) return res.status(400).json({message: "Project Id required"});

    try {
        const foundUser = await User.findOne({username: req.user}).exec();
        if(!foundUser) return res.status(401);  //Unauthorized

        const project  = await Project.findById(projectId).exec();
        if(!project) return res.status(404).json({message: 'Project not found'});

        if(!project.owner.equals(foundUser._id)) return res.status(403).json({message: 'Only owner can delete'});

        await Project.deleteOne({_id: projectId});
        await Task.deleteMany({project: projectId});

        return res.status(200).json({message: 'Project deleted successfully'});
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
}

module.exports = {
    getAllProject,
    createNewProject,
    deleteProject
};