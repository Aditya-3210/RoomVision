const express = require('express');
const router = express.Router();
const { register, login, getUser, updateProfile, updatePassword, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', register);
router.post('/login', login);
router.get('/user', protect, getUser);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;
