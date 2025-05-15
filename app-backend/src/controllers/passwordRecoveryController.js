const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { sendRecoveryEmail } = require('../utils/sendMailUtils');
const { hashPassword } = require('../utils/passwordUtils')

const JWT_SECRET = process.env.PASSWORD_RECOVERY_SECRET || 'meowmeow';


module.exports = {
  forgotPassword: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await UserModel.findByEmail(email);

      if (!user) {
        return res.status(200).json({
          message: 'If the email is registered, you will receive a recovery link.',
        });
      };

      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '10m' });
      
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

      await sendRecoveryEmail(email, resetLink);

      res.status(200).json({
        message: 'If the email is registered, you will receive a recovery link.',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  resetPassword: async (req, res) => {
    const { token, password } = req.body;

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const email = decoded.email;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid token or user does not exist' });
      }
      
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
        });
      }

      const passwordHash = await hashPassword(password);

      await UserModel.updatePassword(email, passwordHash);

      res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (err) {
      console.error(err);

      if (err.name === 'TokenExpiredError') {
        return res.status(400).json({ message: 'Token has expired' });
      }

      res.status(400).json({ message: 'Invalid token' });
    }
  }
};
