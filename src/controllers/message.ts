import { Response } from "express";
import { dataSource } from "../app-data-source";
import { Message } from "../entity/message.entity";
import { RequestWithUser } from "../types";
import { getRequestUserData } from "../utils/auth";

export default class MessageController {
  static getMessages = async (req: RequestWithUser, res: Response) => {
    const messages = await dataSource
      .getRepository(Message)
      .createQueryBuilder("message")
      .where("message.userId = :id", { id: getRequestUserData(req).id })
      .getMany();

    res.send(messages);
  };

  static createMessage = async (req: RequestWithUser, res: Response) => {
    const { text } = req.body as { text: string };

    const messageRepository = dataSource.getRepository(Message);
    const newMessage = messageRepository.create({
      text,
      user: getRequestUserData(req),
    });

    const result = await messageRepository.save(newMessage);

    res.send(result);
  };
}
