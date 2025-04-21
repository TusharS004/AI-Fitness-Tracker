// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;  // Get JWT from cookies\
  // console.log('Token from cookies:', token); // Log the token for debugging
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // Log the decoded user ID
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid Token' });
  }
};

export default verifyToken;
