const projects = require("../Models/projects");

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
            throw new Error('Project not found');
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
            throw new Error('Project not found');
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
        res.status(500).json({ 'message': error.message });
    }
};

module.exports = { handlePostCreateProject, handlePostCreateTask, handleGetProjects, handlePostUpdateProject, handlePostUpdateTask };