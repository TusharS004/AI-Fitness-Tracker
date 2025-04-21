// controllers/user.controller.js
import User from '../models/user.model.js';

import bcrypt from 'bcryptjs';
import generateOTP from '../services/otpService.js';
import nodemailer from 'nodemailer';
import twilioClient from '../config/sms.js';
import jwt from 'jsonwebtoken';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
  }
});


// 📌 User Registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpEmail = generateOTP();
    const otpPhone = generateOTP();

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      otpEmail,
      otpPhone
    });

    await newUser.save();

    // Generate JWT token for session with user data included
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        email: newUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send OTP via email
    await transporter.sendMail({
      from: "yashgoyal2555@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otpEmail}`
    });

    // Send OTP via SMS
    await twilioClient.messages.create({
      body: `Your OTP is ${otpPhone}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+918146786435`,
    });

    // Store only the authentication token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(201).json({ 
      message: 'User registered successfully.', 
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'An unexpected error occurred during registration.' });
  }
};


// 📌 User Login
export const loginUser = async (req, res) => {
  try {
      const { email, password } = req.body;
      if (!email || !password) {
          return res.status(400).json({ message: 'Email and password are required.' });
      }

      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found. Please register first.' });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
          return res.status(401).json({ message: 'Invalid email or password.' });
      }
      const token = jwt.sign(
          { id: user._id, email: user.email, name: user.name },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
      );

      res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV == 'production',
          sameSite: 'None',
          maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({
          message: 'Login successful.',
          token,
          user: {
              userId: user._id
          }
      });

  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};


export const logoutUser = async (req, res) => {
  try {
      // Clear the auth token and any other cookies related to user session
      res.clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV == 'production',
      });
      res.status(200).json({ message: 'Logout successful.' });
  } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'An unexpected error occurred during logout.' });
  }
};


// 📌 Add User Details
// controllers/userController.js

export const addUserDetails = async (req, res) => {
  try {
    // ✅ Use decoded userId from middleware (no need to decode again)
    const userId = req.user;

    // ✅ Log for debugging
    console.log("User ID from middleware:", userId);

    const { dob, gender, weight, height, dailyCalorieGoal, fitnessGoal, activityLevel } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // ✅ Update only provided fields
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;
    if (weight) user.weight = weight;
    if (height) user.height = height;
    if (dailyCalorieGoal) user.dailyCalorieGoal = dailyCalorieGoal;
    if (fitnessGoal) user.fitnessGoal = fitnessGoal;
    if (activityLevel) user.activityLevel = activityLevel;

    // ✅ Calculate BMI
    if (user.weight > 0 && user.height > 0) {
      user.bmi = parseFloat((user.weight / ((user.height / 100) ** 2)).toFixed(2));
    }

    await user.save();

    // ✅ Create new JWT token with updated data
    const newToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        verifiedEmail: user.verifiedEmail,
        verifiedPhone: user.verifiedPhone,
        height: user.height,
        weight: user.weight,
        bmi: user.bmi,
        dailyCalorieGoal: user.dailyCalorieGoal,
        fitnessGoal: user.fitnessGoal,
        activityLevel: user.activityLevel
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // ✅ Set new token cookie
    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000
    });

    // ✅ Return updated info
    res.status(200).json({
      success: true,
      message: 'Details updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        height: user.height,
        weight: user.weight,
        bmi: user.bmi,
        dailyCalorieGoal: user.dailyCalorieGoal,
        fitnessGoal: user.fitnessGoal,
        activityLevel: user.activityLevel
      },
      token: newToken
    });

  } catch (error) {
    console.error('Error updating user details:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }
    res.status(500).json({ success: false, message: 'An error occurred while updating details.' });
  }
};


// Verify Email OTP
export const verifyEmailOtp = async (req, res) => {
  try {
    // Get user information from JWT token
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    const { emailOtp } = req.body;
   
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    if (user.otpEmail !== emailOtp) {
      return res.status(400).json({ message: "Invalid Email OTP. Please try again." });
    }
    
    user.verifiedEmail = true; // Mark email as verified
    await user.save();

    // Check if both email and phone are verified
    if (user.verifiedEmail && user.verifiedPhone) {
      // Both verified, update token with verification status
      const newToken = jwt.sign(
        { 
          userId: user._id, 
          email: user.email,
          phone: user.phone,
          name: user.name,
          verifiedEmail: true,
          verifiedPhone: true
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Set updated token
      res.cookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      return res.json({ 
        message: "Both OTPs verified. Redirecting...", 
        userId: user._id, 
        redirect: "/studentregister2",
        token: newToken
      });
    }

    res.json({ message: "Email OTP verified. Awaiting phone verification." });
  } catch (error) {
    console.error("Error during email OTP verification:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }
    res.status(500).json({ message: "Server error during email OTP verification." });
  }
};

// Verify Phone OTP
export const verifyPhoneOtp = async (req, res) => {
  try {
    // Get user information from JWT token
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    const { phoneOtp } = req.body;
    
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    if (user.otpPhone !== phoneOtp) {
      return res.status(400).json({ message: "Invalid phone OTP. Please try again." });
    }
    
    user.verifiedPhone = true; // Mark phone as verified
    await user.save();

    // Check if both email and phone are verified
    if (user.verifiedEmail && user.verifiedPhone) {
      // Both verified, update token with verification status
      const newToken = jwt.sign(
        { 
          userId: user._id, 
          email: user.email,
          phone: user.phone,
          name: user.name,
          verifiedEmail: true,
          verifiedPhone: true
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Set updated token
      res.cookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      return res.json({ 
        message: "Both OTPs verified. Redirecting...", 
        userId: user._id, 
        redirect: "/studentregister2",
        token: newToken
      });
    }

    res.json({ message: "Phone OTP verified. Awaiting email verification." });
  } catch (error) {
    console.error("Error during phone OTP verification:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }
    res.status(500).json({ message: "Server error during phone OTP verification." });
  }
};


// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Get User Progress
export const getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Update User Progress
export const updateProgress = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { progress: req.body.progress },
      { new: true }
    );
    res.json(updatedUser.progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

