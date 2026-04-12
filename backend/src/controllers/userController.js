import User from '../models/User.js';

export const searchUsers = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      res.status(400).json({ message: 'Email query parameter required' });
      return;
    }

    const users = await User.find({
      email: { $regex: email, $options: 'i' },
      _id: { $ne: req.userId },
    }).limit(10);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, avatar },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};