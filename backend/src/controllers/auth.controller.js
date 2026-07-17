import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Profile from "../models/profile.model.js";
import { OAuth2Client } from "google-auth-library";
import OTP from "../models/otp.model.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const name = payload.name;
    const googleId = payload.sub;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        isVerified: true,
      });

      await Profile.create({
        userId: user._id,
      });
    }

    if (user && !user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
    const jwtToken = user.generateAuthToken();

    



    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      user: userData,
      token: jwtToken,
      message: "google oauth successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "error in google oauth ",
      error: error.message,
    });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if user already exists
    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    await user.save();
    await Profile.create({ userId: user._id });
    const token = await user.generateAuthToken();
    


    res
      .status(201)
      .json({ user, token, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.password) {
      return res.status(400).json({
        message: "Please login using Google",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = user.generateAuthToken();

    



    const userData = user.toObject();
    delete userData.password;

    res
      .status(200)
      .json({ user: userData, token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const logout = async (req, res) => {
  try {

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      return res.status(400).json({
        message: "user already exists",
      });
    }

    const recentOTP = await OTP.findOne({
      email,
      purpose: "signup",
    }).sort({ createdAt: -1 });

    if (recentOTP && Date.now() - recentOTP.createdAt.getTime() < 60 * 1000) {
      const remaining = Math.ceil(
        (60 * 1000 - (Date.now() - recentOTP.createdAt.getTime())) / 1000,
      );

      return res.status(429).json({
        message: `Please wait ${remaining} seconds before requesting another OTP.`,
        retryAfter: remaining,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({
      email,
      purpose: "signup",
    });

    await OTP.create({
      name,
      email,
      password: hashedPassword,
      otp,
      purpose: "signup",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendOTPEmail(email, otp);

    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "error sending OTP",
      error: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({
      email,
      purpose: "signup",
    });
    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        message: "OTP has expired",
      });
    }
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        message: "invalid OTP",
      });
    }

    const existingUser = await User.findOne({
      email: otpRecord.email,
    });

    if (existingUser) {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password,
      isVerified: true,
    });
    await Profile.create({
      userId: user._id,
    });
    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    const jwtToken = user.generateAuthToken();

    



    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      user: userData,
      token: jwtToken,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "error verifying OTP",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const recentOTP = await OTP.findOne({
      email,
      purpose: "reset-password",
    }).sort({ createdAt: -1 });

    if (recentOTP && Date.now() - recentOTP.createdAt.getTime() < 60 * 1000) {
      const remaining = Math.ceil(
        (60 * 1000 - (Date.now() - recentOTP.createdAt.getTime())) / 1000,
      );

      return res.status(429).json({
        message: `Please wait ${remaining} seconds before requesting another OTP.`,
        retryAfter: remaining,
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({
      email,
      purpose: "reset-password",
    });

    await OTP.create({
      email,
      otp,
      purpose: "reset-password",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      message: "Password reset OTP sent successfully",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      message: "Error sending password reset OTP",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const otpRecord = await OTP.findOne({
      email,
      purpose: "reset-password",
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      },
    );

    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Google-only account
    if (!user.password) {
      return res.status(400).json({
        message:
          "This account uses Google Sign-In and does not have a password.",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // Prevent reusing the same password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the current password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error changing password",
      error: error.message,
    });
  }
};
