import express from "express";
import { chatController, messageController } from "../controllers";
import { authMiddleware } from "../middlewares";

const router = express.Router();

router.use(authMiddleware);

router.post("/chat", chatController.createChat);
router.get("/chats", chatController.getChats);
router.post("/chat/:id/invite", chatController.inviteUserToChat);
router.patch("/chat/:id", chatController.updateChat);
router.delete("/chat/:id", chatController.deleteChat);

router.post("/chat/:id/message", messageController.createMessage);
router.get("/chat/:id/messages", messageController.getMessages);

export default router;
