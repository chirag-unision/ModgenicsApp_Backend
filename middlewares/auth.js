const jwt = require("jsonwebtoken");

const secretKey= '8ef03ny423f07fh3f';

exports.auth = async (req, res, next) => {
    const { token } = req.body;
    try {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          console.error('JWT verification failed:', err.message);
          res.status(201).json({ message: 'JWT verification failed', status: false });
        } else {
          console.log('JWT verified successfully:', decoded);
          next();
        }
      });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }