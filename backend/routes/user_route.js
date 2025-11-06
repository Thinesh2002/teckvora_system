import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/user_controllers.js";
import { protect } from "../middleware/user_auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;
