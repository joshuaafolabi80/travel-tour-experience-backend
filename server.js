const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const experienceRoutes = require('./routes/experiences');
const experienceSocket = require('./sockets/experienceSocket');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

// Create app and server
const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Initialize Socket.IO
experienceSocket(io);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));
app.use(express.json());

// Routes
app.use('/api/experiences', experienceRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Tourism Experiences API',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`🚀 Experiences Server running on port ${PORT}`);
  console.log(`📡 WebSocket available on ws://localhost:${PORT}`);
});