const {query} = require('../config/db');

const getTask = async (req, res) => {
    const {projectId} = req.params;
    const {userId} = req.user;
    if(!projectId) return res.status(400).json({message: "Project ID required"});

    try{
       let queryText = `SELECT * FROM tasks 
            WHERE project_id = $1
            AND user_assigned @> ARRAY[$2]::int[]`;
        
        const result = await query(queryText, [projectId, userId]);
        const data = result.rows;

        res.status(200).json(data);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

const createNewTask = async (req, res) => {
    const { projectId } = req.params;
    const {userId} = req.user;
    if(!projectId) return res.status(400).json({message: "Project ID required"});

    try{
        const {task_name, task_description, task_status = 'to-do', end_date, assigned_emails} = req.body
        const dummyDate = new Date();
        const formattedDate = dummyDate.toISOString().split('T')[0];
        const user_assigned = [userId];

        if (assigned_emails && typeof assigned_emails === 'string' && assigned_emails.trim() !== '') {
            const queryText = `
                SELECT id FROM users 
                WHERE email = $1
            `;
            const userResult = await query(queryText, [assigned_emails.trim()]);

            // Safely check if a matching user was found in rows array
            if (userResult.rows.length > 0) {
                const assignedUserId = userResult.rows[0].id;
                
                // Add assigned user ID if it's not already the creator
                if (assignedUserId !== userId) {
                    user_assigned.push(assignedUserId);
                }
            }
        }

        const queryText = `INSERT INTO tasks (
            created_by,
            project_id,
            user_assigned,
            task_name,
            task_description,
            task_status,
            created_at,
            updated_at,
            end_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;

        result = await query(queryText, [userId, projectId, user_assigned, task_name, task_description, task_status, formattedDate, formattedDate, end_date]);
        const newTask = result.rows[0];

        req.io.to(`project_${projectId}`).emit("task_created", newTask);

        res.status(201).json(newTask);

    }catch(err){
        console.log("Failed to create new Task:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteTask = async (req, res) => {
    const { taskId } = req.params;
    if(!taskId) return res.status(400).json({message: "Task ID required"});

    try{
        let queryText = `DELETE FROM tasks
            WHERE id = $1 RETURNING *`

        const result = await query(queryText, [taskId]);

        if(result.rows.length === 0) {
            return res.status(404).json({message: "Failed to delete task"});
        }

        const deletedTask = result.rows[0];

        req.io.to(`project_${deletedTask.project_id}`).emit("task_deleted", taskId);

        return res.status(200).json({message: "task deleted successfully"});
    } catch(err){
        res.status(500).json({message: err.message});
    }
}

const updateTaskStatus = async (req, res) => {
    console.log('Body', req.body);
    const { taskId } = req.params;
    const { task_status } = req.body;

    if(!taskId) return res.status(400).json({message: "Task ID required"});
    if(!task_status) return res.status(400).json({message: "Task status required"});

    try {
        let queryText = `UPDATE tasks 
            SET task_status = $1 
            WHERE id = $2 RETURNING *`;
        
            const result = await query(queryText, [task_status, taskId]);
            const updatedTask = result.rows[0];

            if(!updatedTask) return res.status(404).json({message: "No task found"});

            req.io.to(`project_${updatedTask.project_id}`).emit("task_updated", updatedTask);
            return res.status(200).json(updatedTask);
    }
    catch (err){
        res.status(500).json({message: err.message});
    }
}

module.exports = { 
    getTask,
    createNewTask,
    deleteTask,
    updateTaskStatus
};