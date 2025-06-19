const Configuration = require('../models/Configuration');
const Component = require('../models/Component');
const PDFDocument = require('pdfkit');

exports.getUserConfigurations = async (req, res) => {
  const configs = await Configuration.find({ user: req.user.id }).populate('components.component').populate('components.partner');
  res.json(configs);
};

exports.createConfiguration = async (req, res) => {
  try {
    const config = await Configuration.create({ ...req.body, user: req.user.id });
    res.status(201).json(config);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getConfigurationById = async (req, res) => {
  const config = await Configuration.findById(req.params.id).populate('components.component').populate('components.partner');
  if (!config) return res.status(404).json({ message: 'Not found' });
  res.json(config);
};

exports.deleteConfiguration = async (req, res) => {
  const config = await Configuration.findByIdAndDelete(req.params.id);
  if (!config) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};

// Calcul du coût total
exports.getTotalCost = async (req, res) => {
  const config = await Configuration.findById(req.params.id).populate('components.component').populate('components.partner');
  if (!config) return res.status(404).json({ message: 'Not found' });
  let total = 0;
  for (const item of config.components) {
    const comp = await Component.findById(item.component);
    const priceObj = comp.prices.find(p => p.partner.equals(item.partner));
    if (priceObj) total += priceObj.price;
  }
  res.json({ total });
};

exports.exportConfigurationPDF = async (req, res) => {
  const config = await Configuration.findById(req.params.id)
    .populate('components.component')
    .populate('components.partner')
    .populate('user');
  if (!config) return res.status(404).json({ message: 'Not found' });

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="configuration_${config._id}.pdf"`);

  doc.pipe(res);
  doc.fontSize(18).text(`Configuration: ${config.name}`);
  doc.fontSize(12).text(`Utilisateur: ${config.user.username}`);
  doc.text(`Date: ${config.createdAt.toLocaleString()}`);
  doc.moveDown();

  config.components.forEach((item, idx) => {
    doc.text(
      `${idx + 1}. ${item.component.title} (${item.component.brand}) - Partenaire: ${item.partner?.name || 'N/A'}`
    );
  });

  doc.end();
};