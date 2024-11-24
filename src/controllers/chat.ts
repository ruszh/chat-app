import { Response, Request } from "express";
import { dataSource } from "../app-data-source";
import { Chat } from "../entity/chat.entity";
import { ChatsUsers } from "../entity/chatsUsers.entity";
import { User } from "../entity/user.entity";
import { Message } from "../entity/message.entity";
import { mapUserData } from "../utils/common";

export default class ChatController {
  static getChats = async (req: Request, res: Response) => {
    const userChats = await dataSource
      .getRepository(Chat)
      .createQueryBuilder("chat")
      .where("chat.creatorId = :id", { id: req.user.id })
      .getMany();

    const invitesChats = await dataSource
      .getRepository(ChatsUsers)
      .createQueryBuilder("chatsUsers")
      .where("chatsUsers.userId = :id", { id: req.user.id })
      .getMany();

    const chats = [...userChats, ...invitesChats.map(({ chat }) => chat)];

    res.send(chats);
  };

  static createChat = async (req: Request, res: Response) => {
    const { title } = req.body as { title: string };

    const chatRepository = dataSource.getRepository(Chat);
    const newChat = chatRepository.create({
      title,
      creator: req.user,
    });

    const result = await chatRepository.save(newChat);

    res.send(result);
  };

  static inviteUserToChat = async (req: Request, res: Response) => {
    const { id: chatId } = req.params;

    const { userId } = req.body as { userId: string };

    const chatRepository = dataSource.getRepository(Chat);
    const chatsUsersRepository = dataSource.getRepository(ChatsUsers);
    const userRepository = dataSource.getRepository(User);

    const chat = await chatRepository.findOne({
      relations: {
        creator: true,
      },
      where: { id: chatId, creator: mapUserData(req.user) },
    });

    if (!chat) {
      res.status(404).send({ message: "Chat not found" });
      return;
    }

    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      res.status(400).send({ message: "User is not exist" });
      return;
    }

    const userInChat = await chatsUsersRepository.findOne({
      relations: {
        user: true,
        chat: true,
      },
      where: { user: user, chat: chat },
    });

    if (userInChat) {
      res.status(400).send({ message: "User is already in chat" });
      return;
    }

    const newChatUser = chatsUsersRepository.create({
      user,
      chat,
    });

    await chatsUsersRepository.save(newChatUser);

    res.status(200).send();
  };

  static updateChat = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title } = req.body as { title: string };

    const chatRepository = dataSource.getRepository(Chat);

    const chat = await chatRepository.findOne({
      relations: { creator: true },
      where: { id, creator: mapUserData(req.user) },
    });

    if (!chat) {
      res.status(404).send({ message: "Chat not found" });
      return;
    }

    chat.title = title;
    await chatRepository.save(chat);

    res.send(chat);
  };

  static deleteChat = async (req: Request, res: Response) => {
    const { id } = req.params;

    const chatRepository = dataSource.getRepository(Chat);

    const chat = await chatRepository.findOne({
      relations: { creator: true },
      where: { id, creator: mapUserData(req.user) },
    });

    if (!chat) {
      res.status(404).send({ message: "Chat not found" });
      return;
    }

    await dataSource
      .createQueryBuilder()
      .delete()
      .from(ChatsUsers)
      .where("chatId = :id", { id })
      .execute();

    await dataSource
      .createQueryBuilder()
      .delete()
      .from(Message)
      .where("chatId = :id", { id })
      .execute();

    await chatRepository.remove(chat);

    res.status(200).send();
  };
}
