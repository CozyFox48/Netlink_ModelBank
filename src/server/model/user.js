const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  bankNumber: {
    type: String,
    required: true,
    unique: true
  },
  balance_usd: {
    type: Number,
    required: true,
    default: 0
  },
  balance_eur: {
    type: Number,
    required: true,
    default: 0
  },
  balance_gbp: {
    type: Number,
    required: true,
    default: 0
  },
  user_type: {
    type: String,
    required: true,
    default: 'user'
  },
  password: {
    type: String,
    required: true
  },
  transaction: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transactions'
  }]
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);