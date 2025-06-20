const Category = require('../models/Categories');

exports.getAllCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.createCategory = async (req, res) => {
  const { name, slug } = req.body;
  try {
    const category = new Category({ name, slug });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { name, slug } = req.body;
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: 'Not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Category deleted' });
};

exports.getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Not found' });
  res.json(category);
};