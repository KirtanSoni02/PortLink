// server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authroutes.js"; // ✅ OK
import protectedRoutes from "./routes/protectedroutes.js"; // ✅ OK
import portRoutes from "./routes/portroutes.js"; // ✅ OK, assuming portroutes.js is in the same directory
import shipRoutes from "./routes/shiproutes.js"; // ✅ OK, assuming shiproutes.js is in the same directory
import activeJobRoutes from "./routes/activejobroute.js";
import completedContractRoutes from "./routes/CompletedContractroutes.js"; // ✅ OK, assuming CompletedContractroutes.js is in the same directory
import sailorRoutes from "./routes/sailorroutes.js";
import http from "http";
import { Server } from "socket.io";
import { updateSailorLocation } from "./controllers/shipController.js"; // your location logic
import shipmentApplicationsRoutes from "./routes/shipmentApplication.js";
import aiRoutes from "./routes/ai.js";
import startShipArchiver from "./jobs/shipArchiver.js"; // Import cron job
await connectDB();
startShipArchiver(); // Start the background job

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "https://portlink-realtime-marine-operations-and.onrender.com",
      "http://localhost:5173",
    ];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/port", portRoutes);
app.use("/api/ship", shipRoutes);
app.use("/api/activejob", activeJobRoutes);
app.use("/api/contract", completedContractRoutes);
app.use("/api/sailor", sailorRoutes);
app.use("/api/shipment-applications", shipmentApplicationsRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api/stats", async (req, res) => {
  try {
    const User = (await import("./models/User.model.js")).default;
    const PortAuthority = (await import("./models/PortAuthority.model.js")).default;
    const Ship = (await import("./models/Ship.model.js")).default;
    const CompletedContract = (await import("./models/CompletedContract.model.js")).default;

    const registeredSailors = await User.countDocuments({ role: "sailor" });
    const portAuthorities = await PortAuthority.countDocuments();
    const activeShips = await Ship.countDocuments({ status: "active" });
    const completedContracts = await CompletedContract.countDocuments();

    res.status(200).json({
      registeredSailors: registeredSailors || 2450,
      portAuthorities: portAuthorities || 380,
      activeShips: activeShips || 1200,
      completedContracts: completedContracts || 98,
    });
  } catch (err) {
    console.error("Error fetching platform stats:", err);
    res.status(500).json({ error: "Failed to fetch platform metrics" });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Use same dynamic origins
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  socket.on("sailorLocationUpdate", async (data) => {
    await updateSailorLocation(data); // controller logic
    io.emit("shipLocationUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`🚀 Server with socket.io running at http://localhost:${PORT}`);
});
