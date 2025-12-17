const Project = require('../models/Project');

exports.saveProject = async (req, res) => {
    try {
        const { title, roomImageURL, itemsUsed } = req.body;

        const newProject = new Project({
            userId: req.user.id,
            title,
            roomImageURL,
            itemsUsed
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { title, itemsUsed } = req.body; // roomImageURL usually doesn't change on update unless specified

        let project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Auth check
        if (project.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        project.title = title || project.title;
        project.itemsUsed = itemsUsed;
        // project.roomImageURL = req.body.roomImageURL || project.roomImageURL; // Uncomment if we allow changing room background

        await project.save();
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.getUserProjects = async (req, res) => {
    try {
        // Return projects for the specific user
        const projects = await Project.find({ userId: req.params.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Ensure user owns project or is admin
        if (project.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};
