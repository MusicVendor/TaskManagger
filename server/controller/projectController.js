const {query} = require('../config/db');

const getAllProject = async (req, res) => {
    try {
        const { userId } = req.user;
        
        let queryText = `SELECT p.* FROM PROJECTS p
                JOIN project_members pm ON project_id = p.id
                WHERE user_id = $1`;

        const result = await query(queryText, [userId]);

        return res.status(200).json({projects: result.rows});
    }
    catch (err) {
        res.status(500).json({message: 'Internal Server Error'});
    }
};

const createNewProject = async (req, res) => {
    const { name } = req.body;
    const {userId} = req.user;
    if(!name) name = 'New Page';

    try {
        let queryText = `INSERT INTO projects (
        name) VALUES ($1) RETURNING *`;

        let result = await query(queryText, [name]);

        const newProject = result.rows[0];
        const projectId = newProject.id;

        queryText = `INSERT INTO project_members (
        project_id, 
        user_id
        ) 
        VALUES ($1, $2)`;

        result = await query(queryText, [projectId, userId]);
        res.status(201).json(newProject);
    } 
    catch(err) {
        res.status(500).json({message: err.message});
    }
}

const editProject = async (req, res) => {
    const {projectId} = req.params;
    const {name} = req.body;
    if(!projectId) return res.status(400).json({message: "Project Id required"});

    try {
        let queryText = `UPDATE projects
            SET name = $1
            WHERE id = $2 RETURNING *`;
          
         const result = await query(queryText, [name, projectId]);
         const updatedProject = result.rows[0];

         if(!updatedProject)  return res.status(404).json({message: 'Failed to update the Project'});

         return res.status(200).json({message: "Project name update successfully"});

    } catch(err){
        res.status(500).json({message: err.message});
    }
}

const deleteProject = async (req, res) => {
    const { projectId } = req.params;
    if(!projectId) return res.status(400).json({message: "Project Id required"});

    try {

        let queryText = `DELETE FROM projects
            WHERE id = $1 RETURNING *`;

        const result = await query(queryText, [projectId]);

        if(result.rows.length === 0) {
            return res.status(404).json({message: "Failed to delete project"});
        }

        return res.status(200).json({message: "Project deleted successfully"});
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
}

const getMembers = async (req, res) => {
    const {projectId} = req.params;
    console.log(projectId); //DEBUGGER
    if(!projectId) return res.status(400).json({message: "Project Id required"});

    try{        
        let queryText = `SELECT email FROM users
            WHERE id IN (SELECT user_id FROM project_members 
            WHERE project_id = $1)`;

        const result =  await query(queryText, [projectId]);
        console.log(result);
        if(result.rows.length === 0) return res.status(404).json({message: "Failed to fetch members"});

        return res.status(200).json({members : result.rows});
    } catch(err){
        res.status(500).json(err.message);
    }
}

const addMembers = async (req, res) => {
    const {projectId} = req.params;
    const {email} = req.body;

    if(!projectId || !email) return res.status(404).json({message: "Email id required"});

    try{
        let queryText = `SELECT id FROM
            users WHERE email = $1`;

        let result = await query(queryText, [email]);
        if(result.rows.length === 0){
            return res.status(404).json({message: "User with email is not registered"});
        }
        const userId = result.rows[0].id;

        queryText = `INSERT INTO project_members (
            project_id,
            user_id) VALUES ($1, $2)`
            
        result = await query(queryText, [projectId, userId]);
        
        return res.status(201).json("New member added successfully!");
        
    } catch(err){
        res.status(500).json({message: err.message});
    }
}

module.exports = {
    getAllProject,
    createNewProject,
    editProject,
    deleteProject,
    getMembers,
    addMembers
};