const express = require('express');
const router = express.Router();
const { saveProject, getUserProjects, deleteProject, updateProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.post('/save', protect, saveProject);
router.put('/update/:id', protect, updateProject);
router.get('/user/:id', protect, getUserProjects);
router.delete('/delete/:id', protect, deleteProject);

module.exports = router;
