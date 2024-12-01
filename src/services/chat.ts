import { dataSource } from "../app-data-source";
import { Chat } from "../entity/chat.entity";
import { ChatsUsers } from "../entity/chatsUsers.entity";
import { Message } from "../entity/message.entity";
import { User } from "../types";

export default class ChatService {
  static getChats = async (userId: string) => {
    const userChats = await dataSource
      .getRepository(Chat)
      .createQueryBuilder("chat")
      .where("chat.creatorId = :id", { id: userId })
      .getMany();

    const invitesChats = await dataSource
      .getRepository(ChatsUsers)
      .createQueryBuilder("chatsUsers")
      .where("chatsUsers.userId = :id", { id: userId })
      .getMany();

    const chats = [...userChats, ...invitesChats.map(({ chat }) => chat)];

    return { chats };
  };

  static createChat = async ({
    title,
    user,
  }: {
    title: string;
    user: User;
  }) => {
    const chatRepository = dataSource.getRepository(Chat);
    const newChat = chatRepository.create({
      title,
      creator: user,
    });

    const result = await chatRepository.save(newChat);

    return result;
  };

  static inviteUserToChat = async ({
    chatId,
    user,
  }: {
    chatId: string;
    user: Partial<User>;
  }) => {
    const chatsUsersRepository = dataSource.getRepository(ChatsUsers);
    const chatRepository = dataSource.getRepository(Chat);

    const chat = await chatRepository.findOne({
      relations: {
        creator: true,
      },
      where: { id: chatId, creator: user },
    });

    const newChatUser = chatsUsersRepository.create({
      user,
      chat,
    });

    await chatsUsersRepository.save(newChatUser);
  };
  static updateChat = async ({
    title,
    chatId,
    user,
  }: {
    title: string;
    chatId: string;
    user: Partial<User>;
  }) => {
    const chatRepository = dataSource.getRepository(Chat);
    const chat = await chatRepository.findOne({
      relations: { creator: true },
      where: { id: chatId, creator: user },
    });

    chat.title = title;
    await chatRepository.save(chat);

    return chat;
  };
  static deleteChat = async ({
    chatId,
    user,
  }: {
    chatId: string;
    user: Partial<User>;
  }) => {
    const chatRepository = dataSource.getRepository(Chat);

    const chat = await chatRepository.findOne({
      relations: { creator: true },
      where: { id: chatId, creator: user },
    });

    await dataSource
      .createQueryBuilder()
      .delete()
      .from(ChatsUsers)
      .where("chatId = :id", { id: chatId })
      .execute();

    await dataSource
      .createQueryBuilder()
      .delete()
      .from(Message)
      .where("chatId = :id", { id: chatId })
      .execute();

    await chatRepository.remove(chat);
  };
}
