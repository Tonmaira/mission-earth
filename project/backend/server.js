require("dotenv").config();
const express = require('express');
const http = require("http");
const { connectDB } = require("./config/dbConn");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const createLog = require("./utils/logging");
const { initSocket,broadcastOrdersByType } = require("./service/socket");

const PORT = process.env.BACKEND_PORT || 5050; // Use 5051 as your WS port

// Database Connection
connectDB();

// Express app
const app = express();
const server = http.createServer(app);
initSocket(server);

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Logger middleware
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    try {
      let message = "Request processed";
      if (typeof body === "string" && body.startsWith("{")) {
        const jsonBody = JSON.parse(body);
        if (jsonBody.message) message = jsonBody.message;
      } else if (typeof body === "object" && body.message) {
        message = body.message;
      }
      createLog(req, res.statusCode, message);
    } catch (err) {
      console.error("Error logging response message:", err);
      createLog(req, res.statusCode, "Request processed");
    }
    res.send = originalSend;
    return res.send(body);
  };
  next();
});

// Example route
app.get('/api', (req, res) => res.send('Hello from Node backend!'));

// Main routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/refresh", require("./routes/refresh"));
app.use("/api/users", require("./routes/api/UsersRoutes"));
app.use("/api/medlog", require("./routes/api/MedlogRoutes"));

// 404 handler
app.use((req, res, next) => {
  createLog(req, 404, "Route not found");
  res.status(404).json({ message: "Resource not found" });
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const remark = err.message || "Internal Server Error";
  createLog(req, statusCode, remark);
  res.status(statusCode).json({ message: remark });
});

/* ============================
   Broadcast Interval
   ============================ */

setInterval(() => {
  broadcastOrdersByType();
}, 5000);

/* ============================
   Start Server
   ============================ */

server.listen(PORT, () => {
  console.log(`Socket.IO & Backend server running on port ${PORT}`);
});
