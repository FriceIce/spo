import express from "express";
import { guestLogin, login, refreshToken } from "./user.controller";

const router = express.Router();

router.post("/guestLogin", guestLogin);
router.post("/login", login);
router.post("/refreshToken", refreshToken);

export default router;
