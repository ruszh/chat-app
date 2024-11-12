import express, { Request, Response } from "express";
import { messageController } from "../controllers";
import { authMiddleware } from "../middlewares";

const router = express.Router();

router.use(authMiddleware);

router.post("/message", messageController.createMessage);
router.get("/messages", messageController.getMessages);

export default router;
