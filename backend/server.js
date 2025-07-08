// server.js
import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authroutes.js'; // ✅ OK
import protectedRoutes from './routes/protectedroutes.js'; // ✅ OK

await connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

console.log("ENV JWT_SECRET:", process.env.JWT_SECRET); // ✅ This must print your secret


app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Server is running on port http://localhost:${process.env.PORT}`);
});
