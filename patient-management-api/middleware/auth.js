const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function(req, res, next) {
    const token = req.header('Authorization')
    console.log("Received token:", token)
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });    
    try {
      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (ex) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  };