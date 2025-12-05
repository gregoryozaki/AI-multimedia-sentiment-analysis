import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

// Rota única e correta para o Dashboard
router.get("/", getDashboard);

export default router;
