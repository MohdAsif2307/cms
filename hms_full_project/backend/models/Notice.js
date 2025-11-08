const mongoose = require('mongoose');
const noticeSchema = new mongoose.Schema({
  title: String,
  body: String,
  author: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  postedAt: {type:Date, default: Date.now},
  pinned: {type:Boolean, default:false},
  visibleTo: {type:String, enum:['all','students','staff'], default:'all'}
});
module.exports = mongoose.model('Notice', noticeSchema);
