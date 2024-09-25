const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
      return res.status(403).json({ message: 'Access denied. No token provided.' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
  
      req.user = decoded;
      next();
    });
};  

module.exports = authenticateJWT;
