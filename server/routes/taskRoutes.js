const express = require('express');
const router = express.Router();
const taskController  = require('../controller/taskController');

router.route('/:projectId')
    .get(taskController.getTask)
    .post(taskController.createNewTask);

router.route('/:taskId')
    .patch(taskController.updateTaskStatus)
    .delete(taskController.deleteTask);


module.exports = router;