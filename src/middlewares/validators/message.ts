import { NextFunction, Response, Request } from "express";
import { dataSource } from "../../lib/app-data-source";
import { Message } from "../../entity/message.entity";
import { Chat } from "../../entity/chat.entity";
import { messageRepository, chatRepository } from "../../lib/repositories";

export const createMessageValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { text, chatId, repliedMessageId } = req.body as {
    text: string;
    chatId: string;
    repliedMessageId: string;
  };

  if (!text || !chatId) {
    res.status(400).send("Text and chatId are required");
    return;
  }

  const chat = await chatRepository.findOne({
    where: { id: chatId },
  });

  if (!chat) {
    res.status(404).send({ message: "Chat not found" });
    return;
  }

  if (repliedMessageId) {
    const repliedMessage = await messageRepository.findOne({
      where: { id: repliedMessageId },
    });

    if (!repliedMessage) {
      res.status(404).send({ message: "Replied message not found" });
      return;
    }
  }

  next();
};
