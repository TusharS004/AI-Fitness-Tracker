// models/user.model.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  otpEmail: { type: String },
  otpPhone: { type: String },
  verifiedEmail: { type: Boolean, default: false },
  verifiedPhone: { type: Boolean, default: false },
  dob: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'],required: true },
  
  // Fitness-specific details
  dailyCalorieGoal: { type: Number, default: 2000 },
  workoutStreak: { type: Number, default: 0 },
  totalRewards: { type: Number, default: 0 },
  
  // Challenges Section
  // challenges: [
  //   {
  //     challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
  //     name: { type: String, required: true }, // Store name for easy access
  //     level: { type: String, required: true }, // Level of the challenge
  //     status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  //     progress: { type: Boolean, default: 0 }, // progress
  //     startDate: { type: Date, default: Date.now },
  //     completionDate: { type: Date },
  //     rewardPoints: { type: Number, default: 0 } // Rewards earned from this challenge
  //   }
  // ],
  
  // Activity History (General)
  activityHistory: [
    {
      date: { type: Date, required: true },
      activityType: { type: String, required: true },
      duration: { type: Number, required: true }, // in minutes
      caloriesBurned: { type: Number, required: true },
      repsCount: { type: Number, default: 0 }
    }
  ],
  
  // Progress tracking
  weight: { type: Number, default: 0 }, // in kg
  height: { type: Number, default: 0 }, // in cm
  bmi: { type: Number, default: 0 },
  fitnessGoal: { type: String, enum: ['loseWeight', 'maintainWeight', 'gainWeight', 'buildMuscle'], required: true },
  activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'veryActive'], required: true },
  
  // Timestamps for tracking
  lastWorkoutDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
export default User;
