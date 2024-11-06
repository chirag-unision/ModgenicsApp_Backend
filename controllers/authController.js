const jwt = require("jsonwebtoken");
const { emailSender } = require("./emailSender");

const rand= () => { 
  var minm = 1000000000; 
  var maxm = 9999999000; 
  var n= Math.floor(Math 
  .random() * (maxm - minm + 1)) + minm; 

  return n;
} 

const genOtp= () => { 
  var minm = 1000; 
  var maxm = 9999; 
  var n= Math.floor(Math 
  .random() * (maxm - minm + 1)) + minm; 

  return n;
} 

const secretKey= '8ef03ny423f07fh3f';

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const db= req.db;
    const users= db.users;

    try {
        // Find user with provided email and password
        const user = await users.findOne({ where: { email: email, password: password } });
        if (user) {
            const token = jwt.sign({ email: email }, secretKey, { expiresIn: '672h' });
            res.status(200).json({ message: 'Login successful!', user, token: token });
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.signup= async (req, res) => {
    const { email, username, password } = req.body;
    const db= req.db;
    const users= db.users;
    const uid= 'UID'+rand();

    try {
      // Create a new user with provided email and password
      const user = await users.findOne({ where: { email: email } });
      if (user) {
        res.status(400).json({ message: 'Already registered email.' });
      } else {
        const newUser = await users.create({ uid: uid, email: email, username: username, password: password });
        const token = jwt.sign({ email: email }, secretKey, { expiresIn: '672h' });
  
        res.status(201).json({ message: 'Signup successful!', newUser, token: token });
      }
    } catch (error) {
      // Handle Sequelize unique constraint violation error
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ message: 'Email is already registered.', uid: uid });
      } else {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
}

exports.sendOtp= async (req, res) => {
    const { email } = req.body;
    const db= req.db;
    const users= db.users;
    const otps= db.otps;
    const pid= rand();

    try {
      const user = await users.findOne({ where: { email: email } });
      if (!user) {
        res.status(401).json({ message: 'Not registered email.' });
      } else {
        // Create a new user with provided email and password
        let otp= genOtp();
        const entry = await otps.create({ pid: pid, uid: user.uid, otp: otp });
        emailSender(email, otp);

        res.status(200).send({message: 'OTP sent successfully', pid, user});
      }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.verifyOtp= async (req, res) => {
    const { pid, otp } = req.body;
    const db= req.db;
    const otps= db.otps;

    try {
      // Create a new user with provided email and password
      const user = await otps.findOne({ where: { pid: pid, otp: otp } });
      if (user)
      res.status(201).json({ message: 'Otp successful!', user });
      else
      res.status(401).json({ message: 'Otp unsuccessful!' });
    
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.resetPassword= async (req, res) => {
    const { uid, password } = req.body;
    const db= req.db;
    const users= db.users;

    try {
      const user = await users.update({ password: password }, {
        where: { uid: uid }
      });

      res.status(201).json({ message: 'Signup successful!', user });
    } catch (error) {
      // Handle Sequelize unique constraint violation error
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ message: 'Email is already registered.', uid: uid });
      } else {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
}

exports.validateToken= async (req, res) => {
    const { token } = req.body;
    try {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          console.error('JWT verification failed:', err.message);
          res.status(201).json({ message: 'JWT verification failed', status: false });
        } else {
          console.log('JWT verified successfully:', decoded);
          res.status(201).json({ message: 'JWT verified successfully', status: true });
        }
      });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}




