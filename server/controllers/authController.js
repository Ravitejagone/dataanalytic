const { User } = require('../models');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log('Signup Request:', { username, email, role });
    
    // Explicitly handle role, prioritizing the provided value if it's either 'Administrator' or 'User'
    const finalRole = (role === 'Administrator') ? role : 'User';
    
    const user = await User.create({ 
      username, 
      email, 
      password, 
      role: finalRole 
    });
    
    console.log('User created with role:', user.role);
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({
      token,
      user: { id: user._id.toString(), username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      token,
      user: { id: user._id.toString(), username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Not authenticated' });
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ id: user._id, username: user.username, email: user.email, role: user.role });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, email, role, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password required to change password' });
      if (!(await user.comparePassword(currentPassword))) {
        return res.status(401).json({ message: 'Incorrect current password' });
      }
      user.password = newPassword;
    }

    await user.save();
    res.json({ 
      message: 'Profile updated successfully',
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

module.exports = { signup, login, getCurrentUser, getAllUsers, updateProfile };
