const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/me', auth, userController.getMe);
router.put('/me', auth, userController.updateMe);
router.delete('/me', auth, userController.deleteMe);

router.get('/', auth, admin, userController.getAllUsers);
router.get('/:id', auth, admin, userController.getUserById);
router.put('/:id', auth, admin, userController.updateUser);
router.delete('/:id', auth, admin, userController.deleteUser);

module.exports = router;