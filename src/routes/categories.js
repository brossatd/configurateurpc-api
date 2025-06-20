const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', auth, admin, categoriesController.createCategory);
router.put('/:id', auth, admin, categoriesController.updateCategory);
router.delete('/:id', auth, admin, categoriesController.deleteCategory);
router.get('/', categoriesController.getAllCategories);
router.get('/:id', auth, categoriesController.getCategoryById);

module.exports = router;