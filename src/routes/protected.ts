import express from "express";
import { chatController, messageController } from "../controllers";
import { authMiddleware } from "../middlewares";
import { chat } from "../middlewares/validators";
import { message } from "../middlewares/validators";

const router = express.Router();

router.use(authMiddleware);

router.post("/chat", chat.createChatValidator, chatController.createChat);
router.get("/chats", chatController.getChats);
router.post(
  "/chat/:id/invite",
  chat.inviteUserToChatValidator,
  chatController.inviteUserToChat
);
router.patch("/chat/:id", chat.updateChatValidator, chatController.updateChat);
router.delete("/chat/:id", chat.deleteChatValidator, chatController.deleteChat);

router.post(
  "/chat/:id/message",
  message.createMessageValidator,
  messageController.createMessage
);
router.get("/chat/:id/messages", messageController.getMessages);

export default router;
