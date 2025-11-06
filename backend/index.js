import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/user_route.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/error.js";
import aiRoutes from "./routes/ai/ai.js";

dotenv.config();
const app = express();

// Connect to database
connectDB();

// ✅ Configure CORS properly
const allowedOrigins = [
  "https://system.teckvora.com",  
  "http://localhost:5173"         
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Handle preflight requests
app.options("*", cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
