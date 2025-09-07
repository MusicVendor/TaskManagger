const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectController');

router.route('/')
    .get(projectController.getAllProject)
    .post(projectController.createNewProject);
    
router.delete('/:projectId',projectController.deleteProject);
    

module.exports = router;