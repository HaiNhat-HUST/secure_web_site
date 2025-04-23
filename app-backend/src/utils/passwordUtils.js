const bcrypt = require('bcrypt')

const hassPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password,salt )
};

const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  hassPassword,
  verifyPassword
}