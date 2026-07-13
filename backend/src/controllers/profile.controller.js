import Profile from "../models/profile.model.js";

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });

    return res.status(200).json({
      user: {
        name: req.user.name,
        email: req.user.email,
        isVerified: req.user.isVerified,
        hasPassword: !!req.user.password,
        hasGoogle: !!req.user.googleId,
      },
      profile,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Cannot fetch profile",
      error: err.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      age,
      gender,
      weight,
      height,
      chronicConditions,
      allergies,
      timezone,
    } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          age,
          gender,
          weight,
          height,
          chronicConditions,
          allergies,
          timezone,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Cannot update profile",
      error: err.message,
    });
  }
};
