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
  try {
    const config = await Configuration.findOne({
      _id: req.params.id,
      user: req.user.id
    })
      .populate('components.component')
      .populate('components.partner');

    if (!config) return res.status(404).json({ message: 'Not found' });

    const doc = new PDFDocument();
    let total = 0;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="configuration_${config._id}.pdf"`);

    doc.fontSize(18).text(`Configuration : ${config.name}`, { underline: true });
    doc.moveDown();

    doc.fontSize(14).text('Composants sélectionnés :');
    doc.moveDown();

    config.components.forEach(item => {
      // Trouver le prix pour le partenaire sélectionné
      const priceObj = item.component.prices.find(
        p => p.partner.toString() === item.partner._id.toString()
      );
      const price = priceObj ? priceObj.price : 0;
      total += price;

      doc.fontSize(12).text(
        `${item.component.title} (${item.component.brand}) - Partenaire : ${item.partner.name} - Prix : ${price} €`
      );
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total : ${total} €`, { bold: true });

    doc.end();
    doc.pipe(res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};