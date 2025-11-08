const mongoose = require('mongoose');

const TransferTokenSchema = new mongoose.Schema({
  jti: { type: String, required: true, unique: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

// TTL index: MongoDB will automatically remove documents once `expiresAt` is reached.
// expireAfterSeconds is 0 so the document expires exactly at the time in expiresAt.
TransferTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TransferToken', TransferTokenSchema);
