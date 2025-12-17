const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/projects', protect, admin, async (req, res) => {
    try {
        const projects = await Project.find().populate('userId', 'name email');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
