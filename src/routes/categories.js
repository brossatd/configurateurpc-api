const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoriesController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', auth, admin, categoryController.createCategory);
router.put('/:id', auth, admin, categoryController.updateCategory);
router.delete('/:id', auth, admin, categoryController.deleteCategory);
router.get('/', categoryController.getAllCategories);

module.exports = router;