import express from "express";
import { authController } from "../controllers";
import { auth } from "../middlewares/validators";

const router = express.Router();

router.post(
  "/register",
  auth.registrationValidator,
  authController.registration
);
router.post("/login", auth.loginValidator, authController.login);
router.post(
  "/refresh",
  auth.refreshTokenValidator,
  authController.refreshToken
);

export default router;
