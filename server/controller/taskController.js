const User = require('../models/User');
const Task = require('../models/Task');

const getAllTask = async (req, res) => {
    const {projectId} = req.params;
    if(!projectId) return res.status(400).json({message: "Project ID required"});

    try{
        const task = await Task.find({project: projectId}).exec(); //.populate??

        res.status(200).json(task);
    }
    catch(err){
        res.status(500).json({messgae: err.message});
    }
}

const createNewTask = async (req, res) => {
    const { projectId } = req.params;
    if(!projectId) return res.status(400).json({message: "Project ID required"});

    try {
        const foundUser = await User.findOne({username: req.user}).exec();
        if(!foundUser) return res.sendStatus(401); //Unauthorized

        const ownerId = foundUser._id;
        
        let { title, description, tag, assignedTo = [], status, dueDate } = req.body;

        if(!title) title = "New Task";
        const trimmedTitle = title.trim();

        if(!description) description = "New task created";

        if(!status) status = "to-do";

        if(!tag) return res.status(400).json({message: "Task tag required"});

        const task = new Task ({
            title: trimmedTitle,
            description: description,
            tag: tag,
            createdBy: ownerId,
            assignedTo,
            status: status,
            project: projectId,
            dueDate: dueDate
        });

        const savedTask = await task.save();
        res.status(201).json(savedTask);
        
    }
    catch (err){
        return res.status(500).json({message: err.message});
    }
}

const deleteTask = async (req, res) => {
    const { taskId } = req.params;
    if(!taskId) return res.status(400).json({message: "Task ID required"});

    try {
        const foundUser = await User.findOne({username: req.user}).exec();
        if(!foundUser) return res.sendStatus(401);

        const task = await Task.findById(taskId).exec();
        if(!task) return res.status(404).json({message: "No task found"});

        if(!task.createdBy.equals(foundUser._id)) return res.status(403).json({message: "You have no rights to delete"});

        await Task.deleteOne({_id: taskId});

        return res.status(200).json({message: 'Task deleted successfully'});
    }
    catch (err){
        res.status(500).json({message: err.message});
    }
}

module.exports = { 
    getAllTask,
    createNewTask,
    deleteTask
};