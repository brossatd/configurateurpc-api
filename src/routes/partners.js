// filepath: [partners.js](http://_vscodecontentref_/6)
const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', partnerController.getAllPartners);
router.get('/:id', auth, admin, partnerController.getPartnerById);
router.post('/', auth, admin, partnerController.createPartner);
router.put('/:id', auth, admin, partnerController.updatePartner);
router.delete('/:id', auth, admin, partnerController.deletePartner);

module.exports = router;