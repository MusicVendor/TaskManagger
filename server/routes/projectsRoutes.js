const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectController');

router.route('/')
    .get(projectController.getAllProject)
    .post(projectController.createNewProject);

//ADD Update and Delete Routes    
router.route('/:projectId')
    .patch(projectController.editProject)
    .delete(projectController.deleteProject);

router.route('/:projectId/members')
    .get(projectController.getMembers)
    .post(projectController.addMembers);

module.exports = router;