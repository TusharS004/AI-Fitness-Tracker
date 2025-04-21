// models/challenge.model.js
import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: {},
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    required: true 
  },
  rewards: { type: String, required: true }
}, { timestamps: true });

const Challenge = mongoose.model('Challenge', ChallengeSchema);
export default Challenge;