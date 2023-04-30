const jwt = require('jsonwebtoken');
require('dotenv').config();
 
module.exports = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
      const userId = decodedToken.userId;
      
      if (req.params.id && req.params.id !== userId) {
        throw 'Invalid user ID';
      } else {
        next();
      }
    } catch(error) {
       res.status(401).json({ error });
    }
};