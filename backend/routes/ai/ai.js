import express from "express";
import { generateTitle } from "../../controllers/ai/ai.js";

const router = express.Router();

router.post("/generate-title", generateTitle);

export default router;
