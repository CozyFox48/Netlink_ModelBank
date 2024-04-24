const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  }
});

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', UserSchema);