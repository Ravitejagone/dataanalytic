const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', authController.getCurrentUser);
router.put('/update-profile', protect, authController.updateProfile);
router.get('/users', protect, authorize('Administrator'), authController.getAllUsers);

module.exports = router;
