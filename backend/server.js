// server.js
import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authroutes.js'; // ✅ OK
import protectedRoutes from './routes/protectedroutes.js'; // ✅ OK
import portRoutes from './routes/portroutes.js'; // ✅ OK, assuming portroutes.js is in the same directory
import shipRoutes from './routes/shiproutes.js'; // ✅ OK, assuming shiproutes.js is in the same directory
import activeJobRoutes from './routes/activejobroute.js'; 
import completedContractRoutes from './routes/CompletedContractroutes.js' // ✅ OK, assuming CompletedContractroutes.js is in the same directory
import sailorRoutes from './routes/sailorroutes.js';

await connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: "https://portlink-realtime-marine-operations-and.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/port', portRoutes); 
app.use('/api/ship', shipRoutes)
app.use('/api/activejob', activeJobRoutes); 

app.use('/api/contract', completedContractRoutes);

app.use('/api/sailor', sailorRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});











import http from 'http';
import { Server } from 'socket.io';
// import app from './app.js';
import { updateSailorLocation } from './controllers/shipController.js'; // your location logic

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // allow all or restrict as needed
  },
});

io.on('connection', (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  socket.on('sailorLocationUpdate', async (data) => {
    console.log("📡 Received location update:", data);
    await updateSailorLocation(data); // controller logic
    console.log("Update Done")
    io.emit("shipLocationUpdate", data)
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`🚀 Server with socket.io running at http://localhost:${PORT}`);
});


