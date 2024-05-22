const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
    },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true

  },
  solanaAddress: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('TKNguoiDung', UserSchema);
