// app.js

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { exec } = require("child_process");
const mongoose = require("mongoose");
const fileRoutes = require("./routes/fileRoutes");
const documentRoutes = require("./routes/documentRoutes");
require("dotenv").config();

// ── MongoDB (Mongoose) Connection ──
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB (via Mongoose) connected successfully.");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

// ── Auto-start MongoDB replica-set (if needed locally) ──
exec('mongosh --eval "rs.initiate()"', () => {});

// ── Express + Socket.IO setup ──
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
global.io = io; // For proctoring sockets

// ── Middlewares ──
app.use(cors({
  origin:"https://intervyou-frontend.onrender.com" // ✅ Replace with your actual frontend URL
  credentials: true
}));
app.use(express.json());

// ── Routes ──
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/document", require("./routes/documentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/tests", require("./routes/testRoutes"));
app.use("/api/proctor", require("./routes/proctorRoutes"));
app.use("/api/result", require("./routes/resultRoutes"));
app.use("/api/file", fileRoutes);
app.use("/api/document", documentRoutes); // (If used for uploads/downloads)

// ── Health check ──
app.get("/", (_, res) => res.send("Server running ✅"));

// ── Start server only after DB connects ──
const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
