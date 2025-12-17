const express = require('express');
const router = express.Router();
const { getAllFurniture, addFurniture, updateFurniture, deleteFurniture } = require('../controllers/furnitureController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/all', getAllFurniture);
router.post('/add', protect, admin, addFurniture);
router.put('/edit/:id', protect, admin, updateFurniture);
router.delete('/delete/:id', protect, admin, deleteFurniture);

module.exports = router;
