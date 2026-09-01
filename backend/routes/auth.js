const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { loginLimiter, otpLimiter } = require('../middleware/rateLimiter');
const { validatePhoneNumber, validateOTP, validatePassword, validateUsername, validate } = require('../middleware/validation');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');

// ==========================================
// REQUEST OTP
// ==========================================

router.post('/request-otp', otpLimiter, validatePhoneNumber(), validate, async (req, res) => {
  try {
    const { phoneNumber, countryCode } = req.body;
    
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    
    // Check if user exists
    let user = await User.findOne({ phoneNumber: fullPhoneNumber });
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP before storing (server-side security)
    const otpHash = await argon2.hash(otp);
    
    // Store OTP in Redis with 10-minute expiry
    // In production, use actual Redis
    // await redisClient.setex(`otp:${fullPhoneNumber}`, 600, otpHash);
    
    // For demo, we'll use in-memory (NOT FOR PRODUCTION)
    global.otpStore = global.otpStore || {};
    global.otpStore[fullPhoneNumber] = {
      hash: otpHash,
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0,
      otp: otp  // REMOVE IN PRODUCTION - only for testing
    };
    
    // Send SMS via Twilio (or Firebase)
    // const { sendOTP } = require('../config/twilio');
    // await sendOTP(fullPhoneNumber);
    
    console.log(`[DEV] OTP for ${fullPhoneNumber}: ${otp}`);
    
    res.json({
      success: true,
      message: 'OTP sent successfully',
      phoneNumber: fullPhoneNumber,
      expiresIn: 600
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

// ==========================================
// VERIFY OTP
// ==========================================

router.post('/verify-otp', validateOTP(), validate, async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    const otpData = global.otpStore?.[phoneNumber];
    
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }
    
    if (Date.now() > otpData.expiresAt) {
      delete global.otpStore[phoneNumber];
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }
    
    if (otpData.attempts >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Too many attempts. Please request a new OTP'
      });
    }
    
    // Verify OTP
    const isValid = await argon2.verify(otpData.hash, otp);
    
    if (!isValid) {
      otpData.attempts++;
      return res.status(400).json({
        success: false,
        message: 'Incorrect OTP'
      });
    }
    
    // Check if user exists
    let user = await User.findOne({ phoneNumber });
    const isNewUser = !user;
    
    // Generate session token
    const sessionToken = jwt.sign(
      {
        phoneNumber,
        verified: true,
        isNewUser
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Clean up OTP
    delete global.otpStore[phoneNumber];
    
    res.json({
      success: true,
      message: 'OTP verified successfully',
      sessionToken,
      isNewUser,
      user: user ? {
        id: user._id,
        name: user.name,
        username: user.username,
        profilePhoto: user.profilePhoto
      } : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Verification failed'
    });
  }
});

// ==========================================
// REGISTER NEW USER
// ==========================================

router.post('/register', validateUsername(), validatePassword(), validate, async (req, res) => {
  try {
    const { phoneNumber, sessionToken, username, password, name, about } = req.body;
    
    // Verify session token
    const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
    if (!decoded.verified || decoded.phoneNumber !== phoneNumber) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session'
      });
    }
    
    // Check if user already exists
    let user = await User.findOne({ phoneNumber });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Check username uniqueness
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }
    
    // Hash password with Argon2id
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1
    });
    
    // Create user
    user = new User({
      phoneNumber,
      username,
      passwordHash,
      name,
      about: about || '',
      verified: true,
      verifiedAt: new Date()
    });
    
    await user.save();
    
    // Generate access token
    const accessToken = jwt.sign(
      {
        id: user._id,
        phoneNumber: user.phoneNumber,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '15m' }
    );
    
    // Generate refresh token
    const refreshToken = jwt.sign(
      {
        id: user._id,
        type: 'refresh'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        phoneNumber: user.phoneNumber,
        profilePhoto: user.profilePhoto,
        verified: user.verified
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// ==========================================
// LOGIN EXISTING USER
// ==========================================

router.post('/login', loginLimiter, validatePassword(), validate, async (req, res) => {
  try {
    const { phoneNumber, sessionToken, password } = req.body;
    
    // Verify session token
    const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
    if (!decoded.verified || decoded.phoneNumber !== phoneNumber) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session'
      });
    }
    
    // Find user
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password'
      });
    }
    
    // Check if account is suspended
    if (user.suspendedUntil && user.suspendedUntil > new Date()) {
      return res.status(403).json({
        success: false,
        message: 'Account is suspended'
      });
    }
    
    // Generate tokens
    const accessToken = jwt.sign(
      {
        id: user._id,
        phoneNumber: user.phoneNumber,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '15m' }
    );
    
    const refreshToken = jwt.sign(
      {
        id: user._id,
        type: 'refresh'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );
    
    // Update last seen
    user.lastSeen = new Date();
    await user.save();
    
    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        phoneNumber: user.phoneNumber,
        profilePhoto: user.profilePhoto,
        verified: user.verified
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// ==========================================
// LOGOUT
// ==========================================

router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Invalidate token by adding to blacklist (optional)
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

module.exports = router;
