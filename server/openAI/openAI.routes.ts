import express from "express";
import { getGenres, getRecommendations } from "./openAI.controller";

const router = express.Router();

router.get("/getGenres", getGenres, getRecommendations);

export default router;
