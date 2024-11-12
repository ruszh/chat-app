import express from "express";
import { authController } from "../controllers";

const router = express.Router();

router.post("/register", authController.registration);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);

export default router;
