const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

app.use('/api/details', require('./routes/details/auth.routes'));
app.use('/api/details/student', require('./routes/details/student-details.route'));
app.use('/api/details/admin', require('./routes/details/admin-details.route'));
app.use('/api/hostel', require('./routes/details/hostel.bridge.route'));

app.get('/', (req, res) => res.json({ msg: 'CMS backend running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port', PORT));
