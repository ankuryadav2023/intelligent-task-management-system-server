const projects = require("../Models/projects");
const { CohereClient } = require('cohere-ai');
require('dotenv').config();
const ai = new CohereClient({ token: process.env.COHEREAI_API_KEY });

const handlePostCreateProject = (req, res) => {
    const projectData = { ...req.body, tasks: [] };
    projects.create(projectData)
        .then(data => {
            res.json({ 'message': 'Project Created Successfully.' });
        }).catch(error => {
            console.log(error);
            res.json({ 'message': 'Sorry! Some Error Occured. Please Try Again.' })
        });
}

const handlePostCreateTask = async (req, res) => {
    try {
        const project = await projects.findById(req.body.projectID);
        if (!project) {
            throw new Error('Project not found');
        }
        const taskData = {
            title: req.body.title,
            description: req.body.description,
            createdBy: req.body.createdBy,
            assignedTo: req.body.assignedTo,
            status: req.body.status,
            dueDate: req.body.dueDate,
            priority: req.body.priority
        }
        project.tasks.push(taskData);
        await project.save();
        res.json({ 'message': 'Task Created Successfully.' })
    } catch (error) {
        console.log(error);
        res.json({ 'message': error.message })
    }
}

const handleGetProjects = async (req, res) => {
    const { organizationID } = req.query;

    try {
        const projects_array = await projects.find({ organizationID });

        if (!projects_array || projects_array.length === 0) {
            return res.json({ projects: [] });
        }

        res.json({ projects: projects_array });
    } catch (error) {
        console.log(error);
        res.json({ projects: [] });
    }
}

const handlePostUpdateProject = async (req, res) => {
    try {
        const projectId = req.body._id;
        const projectData = req.body;

        const updatedProject = await projects.findByIdAndUpdate(
            projectId,
            { $set: projectData },
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            throw new Error('Project not found.');
        }

        res.json({ 'message': 'Project Updated Successfully.' });
    } catch (error) {
        console.log(error);
        res.json({ 'message': error.message });
    }
};


const handlePostUpdateTask = async (req, res) => {
    try {
        let project = await projects.findById(req.params.projectID);
        if (!project) {
            throw new Error('Project not found.');
        }

        const taskData = req.body;
        const taskId = req.params.taskID;

        project.tasks = project.tasks.map(task => {
            if (task._id.equals(taskId)) {
                return { ...task._doc, ...taskData };
            } else {
                return task;
            }
        });

        await project.save();
        res.json({ 'message': 'Task Updated Successfully.' });
    } catch (error) {
        console.log(error);
        res.json({ 'message': error.message });
    }
};

const handleDeleteProject=async (req,res)=>{
    try {
        const projectId = req.params.projectID;

        const project = await projects.findByIdAndDelete(projectId);

        if (!project) {
            throw new Error('Project not found.');
        }

        res.json({ 'message': 'Project Deleted Successfully.' });
    } catch (error) {
        console.log(error);
        res.json({ 'message': error.message });
    }
};

const handleDeleteTask = async (req, res) => {
    try {
        const { projectID, taskID } = req.params;

        let project = await projects.findById(projectID);

        if (!project) {
            throw new Error('Project not found.');
        }

        const taskIndex = project.tasks.findIndex(task => task._id.toString() === taskID);
        
        if (taskIndex === -1) {
            throw new Error('Task not found.');
        }

        project.tasks.splice(taskIndex, 1);

        await project.save();

        res.json({ message: 'Task Deleted Successfully.' });
    } catch (error) {
        console.error(error);
        res.json({ 'message': error.message });
    }
};

const handleGetChatbot=async (req,res)=>{
    let prompt=`You are an helpful chatbot named Zappy and you are working for a company named Zaptask. Zaptask is an intelligent task management system designed to streamline your project management workflow. It allows users to create and manage organizations, projects, and tasks efficiently. With seamless integration of features like user authentication, real-time updates, and task prioritization, Zaptask ensures optimal team collaboration and productivity. You can also chat in real-time with other organization members. Note that only authorized members can delete or update tasks and projects, ensuring security and control within your organization.
    Your task is to respond to below given user\'s query.
    User's Query: ${req.query.q}`
    try {
        const response = await ai.generate({ prompt:prompt });
        res.json({ 'response': response.generations[0].text });
    } catch (error) {
        console.log(error);
        res.json({ 'response': error.message });
    }
}

module.exports = { handlePostCreateProject, handlePostCreateTask, handleGetProjects, handlePostUpdateProject, handlePostUpdateTask, handleDeleteProject, handleDeleteTask, handleGetChatbot };