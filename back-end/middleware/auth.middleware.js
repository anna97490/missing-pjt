const jwt = require('jsonwebtoken');
require('dotenv').config();
 
module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (!token) {
      throw 'Invalid token';
    } else {
      next();
    }
  } catch(error) {
      res.status(401).json({ error });
  }
};