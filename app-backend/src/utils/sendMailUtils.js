const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: "hainhat365@gmail.com",      
    pass: "evnn unuy klrt iymc",      
  },
});

const sendRecoveryEmail = async (email, link) => {
  const mailOptions = {
    from: '"Exploymee" <no-reply@employmee.com>',
    to: email,
    subject: 'Reset your password',
    html: `
      <p>Click the link below to reset your password:</p>
      <a href="${link}">${link}</a>
      <p>This link will expire in 10 minutes.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {sendRecoveryEmail};