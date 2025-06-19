const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, admin, userController.getAllUsers);
router.get('/:id', auth, admin, userController.getUserById);
router.get('/me', auth, userController.getMe);
router.put('/me', auth, userController.updateMe);
router.delete('/me', auth, userController.deleteMe);

module.exports = router;