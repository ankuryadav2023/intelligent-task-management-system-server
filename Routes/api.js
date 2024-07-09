const {Router}=require('express');
const { handlePostCreateProject, handlePostCreateTask, handleGetProjects, handlePostUpdateProject, handlePostUpdateTask, handleDeleteProject, handleDeleteTask, handleGetChatbot } = require('../Controllers/api');

const router=Router();

router.post('/create-project',handlePostCreateProject);
router.post('/create-task',handlePostCreateTask);
router.get('/get-projects',handleGetProjects);
router.post('/update-project',handlePostUpdateProject);
router.post('/update-task/:projectID/:taskID',handlePostUpdateTask);
router.delete('/delete-project/:projectID',handleDeleteProject);
router.delete('/delete-task/:projectID/:taskID',handleDeleteTask);
router.get('/chatbot',handleGetChatbot);

module.exports=router;