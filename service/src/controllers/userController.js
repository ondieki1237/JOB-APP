const User = require('../models/User');

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      username,
      phoneNumber,
      bio,
      location,
      skills,
      preferredCurrency
    } = req.body;

    // Build update object
    const updateData = {
      $set: {
        'profile.bio': bio,
        'profile.location': location,
        'profile.skills': skills,
        'profile.preferredCurrency': preferredCurrency
      }
    };

    // Only update username and phone if provided
    if (username) updateData.$set.username = username;
    if (phoneNumber) updateData.$set.phoneNumber = phoneNumber;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Structure the response data
    const profileData = {
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: {
        bio: user.profile?.bio || '',
        location: user.profile?.location || '',
        skills: user.profile?.skills || [],
        preferredCurrency: user.profile?.preferredCurrency || 'KES',
        avatar: user.profile?.avatar || '',
      },
      verified: user.verified,
    };

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      user: profileData
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};
