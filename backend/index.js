import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/user_route.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/error.js";
import aiRoutes from "./routes/ai/ai.js";

dotenv.config();
const app = express();

connectDB();

// ✅ CORS setup
const allowedOrigins = [
  "https://system.teckvora.com", // your frontend domain
  "http://localhost:5173"        // for local dev (optional)
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow curl, mobile, etc.
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy does not allow access from origin ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
