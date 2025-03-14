const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/user'); // Import User model
require('dotenv').config();

const clients = new Set(); // Store connected clients

const startWebSocketServer = (server) => {
    const wss = new WebSocket.Server({ server });

    console.log("🚀 WebSocket server is starting...");

    wss.on('connection', async (ws, req) => {
        console.log("🔌 New WebSocket client connected");

        // 1️⃣ Extract token correctly from WebSocket URL
        const queryParams = new URLSearchParams(req.url.split('?')[1]);
        const token = queryParams.get('token');

        if (!token) {
            console.log("🚫 No token provided, closing connection.");
            ws.close();
            return;
        }

        try {
            // 2️⃣ Verify token and extract rollNumber
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const rollNumber = decoded.rollNumber;

            console.log(`🔍 Fetching department for rollNumber: ${decoded.rollNumber}`);

            // 3️⃣ Fetch user from database
            const user = await User.findOne({ rollNumber });
            if (!user) {
                console.log("❌ User not found, closing connection.");
                ws.close();
                return;
            }

            // 4️⃣ Assign department to WebSocket client
            ws.department = user.department;
            clients.add(ws);

            console.log(`✅ Client connected with department: ${ws.department}`);
            console.log(`👥 Total connected clients: ${clients.size}`);

            // 5️⃣ Handle client disconnect
            ws.on('close', () => {
                clients.delete(ws);
                console.log("❌ Client disconnected.");
                console.log(`👥 Remaining clients: ${clients.size}`);
            });

            // 6️⃣ Handle errors
            ws.on('error', (error) => {
                console.error("⚠️ WebSocket error:", error);
            });

            // ✅ Send a confirmation message
            ws.send(JSON.stringify({ message: "🎉 WebSocket connection successful!" }));

        } catch (error) {
            console.log("🚫 Invalid token, closing connection.");
            ws.close();
        }
    });

    console.log("✅ WebSocket server attached to Express HTTP server!");
};


// Function to send notifications to specific departments
const sendNotificationToDepartment = (message, targetDepartments) => {
    console.log("📢 Sending notification...");
    console.log("📩 Message:", message);
    console.log("🎯 Target Departments:", targetDepartments);
    console.log(`👥 Connected Clients: ${clients.size}`);

    let count = 0; // Counter for successful notifications

    clients.forEach(client => {
        console.log(`🔍 Checking client (Department: ${client.department})`);

        if (client.readyState === WebSocket.OPEN && targetDepartments.includes(client.department)) {
            console.log(`✅ Sending notification to client in ${client.department}`);
            client.send(JSON.stringify(message));
            count++;
        } else {
            console.log(`❌ Skipping client (Department: ${client.department})`);
        }
    });

    console.log(`✅ Notification process completed! Sent to ${count} people.`);
};

module.exports = { startWebSocketServer, sendNotificationToDepartment };
