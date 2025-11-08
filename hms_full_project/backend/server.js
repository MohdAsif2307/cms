require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// ✅ Import all available routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');
const entryRoutes = require('./routes/entry'); // ✅ correct name
const complaintRoutes = require('./routes/complaint');
const noticeRoutes = require('./routes/notice');
const roomRoutes = require("./routes/room");
const ssoRoutes = require('./routes/sso');

const app = express();
const server = http.createServer(app);
// Configure CORS to allow credentials so server can set cookies during SSO
const clientOrigin = process.env.HMS_FRONTEND_URL || process.env.VITE_FRONTEND_URL || 'http://localhost:5173';
const io = new Server(server, { cors: { origin: clientOrigin, credentials: true } });

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());
app.set('io', io);

// ✅ Register routes with proper prefixes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/entry', entryRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notices', noticeRoutes);
app.use("/api/rooms", roomRoutes);
// SSO route for CMS->HMS token exchange
app.use('/api/sso', ssoRoutes);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/hms';

console.log('Running in ENV:', process.env.NODE_ENV);

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Mongo connected');
      server.listen(PORT, () => console.log('Server running on', PORT));
    })
    .catch(err => console.error('Mongo connection failed', err));
}

module.exports = { app, server };
