const mongoose = require('mongoose');

const listItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  department: { type: String, required: true },
  dateOfJoining: { type: Date, required: true },
  hobbies: [{ type: String }],
  gender: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('ListItem', listItemSchema); 