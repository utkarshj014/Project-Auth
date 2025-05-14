import bcryptjs from "bcryptjs";
import crypto from "crypto";

import User from "../models/User.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../sendgrid/emails.js";

// import { sendVerificationEmail } from "../mailtrap/sendEmail.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!!" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12); //1234 -> 1234asfjklasj

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await newUser.save();

    // jwt
    generateTokenAndSetCookie(res, newUser._id);

    // email verification
    await sendVerificationEmail(email, name, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully!",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error!!" });
  }
};

export const verifyEmail = async (req, res) => {
  const { code, email } = req.body;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required!!" });
    }

    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Verification code is required!!" });
    }

    const user = await User.findOne({
      email: email,
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code!!",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;

    await user.save();

    // Welcome Email
    await sendWelcomeEmail(user.email, user.name.split(" ", 1)[0]);

    res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error!!" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });
    }

    if (!user.isVerified) {
      const verificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      user.verificationToken = verificationToken;
      user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    }

    user.lastLogin = Date.now();

    await user.save();

    // jwt
    generateTokenAndSetCookie(res, user._id);

    // if Not Verified
    if (!user.isVerified) {
      await sendVerificationEmail(email, user.name, verificationToken);
    }

    return res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error!!" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully..." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error!!" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }

    // Less secure and not recommended
    // user.resetPasswordToken = Math.floor(
    //   100000 + Math.random() * 900000
    // ).toString();

    user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 60 minutes

    await user.save();

    await sendPasswordResetEmail(
      email,
      `${process.env.CLIENT_URL}/reset-password/${user.resetPasswordToken}`
    );

    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error!!" });
  }
};

export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required!!" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiresAt = null;

    await user.save();

    await sendPasswordResetSuccessEmail(user.email, user.name.split(" ", 1)[0]);

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error!!" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    if (!req.userID) {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    const user = await User.findById(req.userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error!!" });
  }
};
