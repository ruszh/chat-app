import { Response, Request } from "express";
import MessageService from "../services/message";
import { mapUserData } from "../utils/common";

export default class MessageController {
  static getMessages = async (req: Request, res: Response) => {
    const messages = await MessageService.getMessages({
      chatId: req.params.id,
      userId: req.user.id,
    });

    res.send(messages);
  };

  static createMessage = async (req: Request, res: Response) => {
    const { text, chatId, repliedMessageId } = req.body as {
      text: string;
      chatId: string;
      repliedMessageId?: string;
    };

    const result = await MessageService.createMessage({
      text,
      chatId,
      repliedMessageId,
      user: mapUserData(req.user),
    });

    res.send(result);
  };
}
