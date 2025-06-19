const Partner = require('../models/Partner');

exports.getAllPartners = async (req, res) => {
  const partners = await Partner.find();
  res.json(partners);
};

exports.createPartner = async (req, res) => {
  try {
    const partner = await Partner.create(req.body);
    res.status(201).json(partner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: 'Partenaire non trouvé' });
    res.json(partner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePartner = async (req, res) => {
  try {
    const updatedPartner = await Partner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPartner) return res.status(404).json({ message: 'Partenaire non trouvé' });
    res.json(updatedPartner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) return res.status(404).json({ message: 'Partenaire non trouvé' });
    res.json({ message: 'Partenaire supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
