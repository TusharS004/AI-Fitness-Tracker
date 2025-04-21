import Challenge from "../models/challenges.model.js";
import User from "../models/user.model.js";
// Get All Challenges
export const getAllChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find();
        res.json(challenges);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve challenges' });
    }
};

// Get Challenge by ID
export const getChallengeById = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const challenge = await Challenge.findById(challengeId);

        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        res.json(challenge);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve challenge' });
    }
};

// Join Challenge
export const joinChallenge = async (req, res) => {
    try {
        // const { userId } = req.userId;
        const { challengeId } = req.params;

        // Check if the Challenge exists
        const challenge = await Challenge.findById(challengeId);
        console.log(challenge);
        if (!challenge) {
          return res.status(404).json({ message: 'Challenge not found' });
        }
        
        const user = await User.findById(userId);

        // const alreadyJoined = user.activityHistory.some(
        //   (c) => c.challengeId.toString() === challengeId
        // );
        // if (alreadyJoined) {
        //   return res.status(400).json({ message: 'You have already joined this challenge' });
        // }

        user.activeChallenges.push({ 
          challengeId: challenge._id, 
          startDate: new Date(), 
          progress: 0 
        });
        await user.save();
        
        res.status(200).json({ message: 'Challenge started successfully' });

    } catch (error) {
        console.error('Error starting challenge:', error);
        res.status(500).json({ message: 'Failed to start challenge' });
    }   
};





// Get Challenge Progress
export const getChallengeProgress = async (req, res) => {
    try {
        const { challengeId, userId } = req.params;
        
        // Add logic to retrieve the progress of the challenge with the given challengeId and userId
        
        res.json({ progress: 50 }); // Replace 50 with the actual progress value
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve challenge progress' });
    }
};