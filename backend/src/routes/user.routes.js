// routes/user.routes.js
import express from 'express'
const router = express.Router();
import verifyToken  from '../middlewares/auth.middleware.js';

import * as userController from '../controllers/user.controller.js';

// User Authentication
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);


// User Verification
router.post("/verifyEmailOtp", userController.verifyEmailOtp);
router.post("/verifyPhoneOtp", userController.verifyPhoneOtp);

// Resend Otp
// router.post("/resendEmailOtp", userController.verifyEmailOtp);
// router.post("/resendPhoneOtp", userController.verifyPhoneOtp);

// User Profile & Details
router.get('/profile',verifyToken, userController.getUserProfile);
router.post('/profile',verifyToken, userController.addUserDetails);

// Fitness Goals & Progress
router.get('/progress',verifyToken, userController.getProgress);
router.put('/progress',verifyToken, userController.updateProgress);

export default router;
