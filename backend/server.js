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
import sailorRoutes from './routes/sailorRoutes.js';

await connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/port', portRoutes); // ✅ OK, assuming port.js is in protectedroutes.js
// console.log("ENV JWT_SECRET:", process.env.JWT_SECRET); // ✅ This must print your secret
app.use('/api/ship', shipRoutes)
app.use('/api/activejob', activeJobRoutes); // ✅ OK, assuming activejobroute.js is in the same directory

app.use('/api/contract', completedContractRoutes);

app.use('/api/sailor', sailorRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Server is running on port http://localhost:${process.env.PORT}`);
});
