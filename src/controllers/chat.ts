import { Response, Request } from "express";
import { mapUserData } from "../utils/common";
import ChatService from "../services/chat";

export default class ChatController {
  static getChats = async (req: Request, res: Response) => {
    const { chats } = await ChatService.getChats(req.user.id);

    res.send(chats);
  };

  static createChat = async (req: Request, res: Response) => {
    const { title } = req.body as { title: string };

    const result = await ChatService.createChat({ title, user: req.user });

    res.send(result);
  };

  static inviteUserToChat = async (req: Request, res: Response) => {
    const { id: chatId } = req.params;

    await ChatService.inviteUserToChat({ chatId, user: mapUserData(req.user) });

    res.status(200).send();
  };

  static updateChat = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title } = req.body as { title: string };

    const chat = await ChatService.updateChat({
      chatId: id,
      title,
      user: mapUserData(req.user),
    });

    res.send(chat);
  };

  static deleteChat = async (req: Request, res: Response) => {
    const { id } = req.params;

    await ChatService.deleteChat({ chatId: id, user: mapUserData(req.user) });

    res.status(200).send();
  };
}
