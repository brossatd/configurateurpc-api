const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  // Optionnel : vérifie si user est admin
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  const users = await User.find().select('-password');
  res.json(users);
};

exports.getUserById = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
};

exports.updateMe = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
};

exports.deleteMe = async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.json({ message: 'Account deleted' });
};

exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};