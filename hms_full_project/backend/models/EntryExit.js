const mongoose = require('mongoose');
const entryExitSchema = new mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  type: {type:String, enum:['entry','exit'], required:true},
  timestamp: {type:Date, default: Date.now},
  location: {
    lat: Number,
    lng: Number
  },
  source: {type:String, enum:['mobile','web','admin'], default:'mobile'}
});
module.exports = mongoose.model('EntryExit', entryExitSchema);
