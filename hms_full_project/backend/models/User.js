const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {type:String, required:true},
  email: {type:String, required:true, unique:true},
  passwordHash: {type:String, required:true},
  role: {type:String, enum:['student','admin','staff'], default:'student'},
  phone: String,
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  profile: {
    fatherName: String,
    emergencyContact: String,
    address: String,
    photoUrl: String
  },
  registeredAt: {type:Date, default: Date.now},
  isActive: {type:Boolean, default:true},
});
module.exports = mongoose.model('User', userSchema);
