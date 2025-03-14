const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const { startWebSocketServer } = require('./websocket');
const cors = require('cors');
const http = require('http');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app); // Create an HTTP server

// Allow CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.get('/',(req,res)=>{
    res.send('Hello World');
})
// Start WebSocket Server
startWebSocketServer(server);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);

const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
