import { Response, Request } from "express";
import { dataSource } from "../app-data-source";
import { Message } from "../entity/message.entity";
import { Chat } from "../entity/chat.entity";

export default class MessageController {
  static getMessages = async (req: Request, res: Response) => {
    const { id: chatId } = req.params;

    const messages = await dataSource
      .getRepository(Message)
      .createQueryBuilder("message")
      .where("message.userId = :id AND message.chatId = :chatId", {
        id: req.user.id,
        chatId,
      })
      .getMany();

    res.send(messages);
  };

  static createMessage = async (req: Request, res: Response) => {
    const { text, chatId, repliedMessageId } = req.body as {
      text: string;
      chatId: string;
      repliedMessageId: string;
    };

    const messageRepository = dataSource.getRepository(Message);
    const chatRepository = dataSource.getRepository(Chat);

    const chat = await chatRepository.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      res.status(404).send({ message: "Chat not found" });
      return;
    }

    let newMessage = messageRepository.create({
      text,
      user: req.user,
      chat,
    });

    if (repliedMessageId) {
      const repliedMessage = await messageRepository.findOne({
        where: { id: repliedMessageId },
      });

      if (!repliedMessage) {
        res.status(404).send({ message: "Replied message not found" });
        return;
      }

      newMessage = messageRepository.create({
        text,
        user: req.user,
        chat,
        repliedMessage,
      });
    }

    const result = await messageRepository.save(newMessage);

    res.send(result);
  };
}
