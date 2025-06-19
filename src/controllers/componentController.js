const Component = require('../models/Component');

exports.getAllComponents = async (req, res) => {
  const components = await Component.find().populate('category').populate('prices.partner');
  res.json(components);
};

exports.getComponentById = async (req, res) => {
  const component = await Component.findById(req.params.id).populate('category').populate('prices.partner');
  if (!component) return res.status(404).json({ message: 'Not found' });
  res.json(component);
};

exports.createComponent = async (req, res) => {
  try {
    const component = await Component.create(req.body);
    res.status(201).json(component);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateComponent = async (req, res) => {
  try {
    const component = await Component.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!component) return res.status(404).json({ message: 'Not found' });
    res.json(component);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteComponent = async (req, res) => {
  const component = await Component.findByIdAndDelete(req.params.id);
  if (!component) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};

exports.searchComponents = async (req, res) => {
  const { brand, title, minPrice, maxPrice } = req.query;
  const filter = {};
  if (brand) filter.brand = brand;
  if (title) filter.title = { $regex: title, $options: 'i' };
  if (minPrice || maxPrice) filter['prices.price'] = {};
  if (minPrice) filter['prices.price'].$gte = Number(minPrice);
  if (maxPrice) filter['prices.price'].$lte = Number(maxPrice);

  const components = await Component.find(filter).populate('category').populate('prices.partner');
  res.json(components);
};

exports.addOrUpdatePrice = async (req, res) => {
  const { partner, price } = req.body;
  const component = await Component.findById(req.params.id);
  if (!component) return res.status(404).json({ message: 'Not found' });
  const priceObj = component.prices.find(p => p.partner.equals(partner));
  if (priceObj) {
    priceObj.price = price;
  } else {
    component.prices.push({ partner, price });
  }
  await component.save();
  res.json(component);
};

exports.deletePrice = async (req, res) => {
  const component = await Component.findById(req.params.id);
  if (!component) return res.status(404).json({ message: 'Not found' });
  component.prices = component.prices.filter(p => !p.partner.equals(req.params.partnerId));
  await component.save();
  res.json(component);
};