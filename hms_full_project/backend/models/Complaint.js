const mongoose = require('mongoose');
const complaintSchema = new mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  title: String,
  description: String,
  images: [String],
  status: {type:String, enum:['pending','sorted','rejected'], default:'pending'},
  createdAt: {type:Date, default: Date.now},
  adminComment: String
});
module.exports = mongoose.model('Complaint', complaintSchema);
