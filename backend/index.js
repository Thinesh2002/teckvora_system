import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/user_route.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/error.js";

dotenv.config();
const app = express();


connectDB(); 

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
