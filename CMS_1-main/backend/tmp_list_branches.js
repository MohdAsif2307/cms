const mongoose = require('mongoose');
(async ()=>{
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cms');
    const docs = await mongoose.connection.db.collection('branches').find({}).limit(5).toArray();
    console.log(JSON.stringify(docs, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('ERR', e);
    process.exit(2);
  }
})();
