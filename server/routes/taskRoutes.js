const express = require('express');
const router = express.Router();
const taskController  = require('../controller/taskController');

router.route('/:projectId')
    .get(taskController.getAllTask)
    .post(taskController.createNewTask);

router.delete('/:taskId', taskController.deleteTask);


module.exports = router;