const {Router}=require('express');
const { handlePostCreateProject, handlePostCreateTask, handleGetProjects, handlePostUpdateProject, handlePostUpdateTask } = require('../Controllers/api');

const router=Router();

router.post('/create-project',handlePostCreateProject);
router.post('/create-task',handlePostCreateTask);
router.get('/get-projects',handleGetProjects);
router.post('/update-project',handlePostUpdateProject);
router.post('/update-task/:projectID/:taskID',handlePostUpdateTask);

module.exports=router;