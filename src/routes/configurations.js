const express = require('express');
const router = express.Router();
const configurationController = require('../controllers/configurationController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, configurationController.getUserConfigurations);
router.post('/', auth, configurationController.createConfiguration);
router.get('/all', auth, admin, configurationController.getAllConfigurations);
router.get('/:id', auth, configurationController.getConfigurationById);
router.delete('/:id', auth, configurationController.deleteConfiguration);
router.get('/:id/total', auth, configurationController.getTotalCost);
router.get('/:id/pdf', auth, configurationController.exportConfigurationPDF);


module.exports = router;