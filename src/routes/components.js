// filepath: [components.js](http://_vscodecontentref_/5)
const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', componentController.getAllComponents);
router.get('/:id', componentController.getComponentById);
router.post('/', auth, admin, componentController.createComponent);
router.put('/:id', auth, admin, componentController.updateComponent);
router.delete('/:id', auth, admin, componentController.deleteComponent);
router.get('/search', componentController.searchComponents);
router.post('/:id/prices', auth, admin, componentController.addOrUpdatePrice);
router.delete('/:id/prices/:partnerId', auth, admin, componentController.deletePrice);

module.exports = router;