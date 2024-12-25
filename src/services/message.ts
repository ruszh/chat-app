import { dataSource } from "../lib/app-data-source";
import { Message } from "../entity/message.entity";
import { Chat } from "../entity/chat.entity";
import { User } from "../types";

export default class MessageService {
  static createMessage = async ({
    text,
    chatId,
    repliedMessageId,
    user,
  }: {
    text: string;
    chatId: string;
    repliedMessageId?: string;
    user: Partial<User>;
  }) => {
    const messageRepository = dataSource.getRepository(Message);
    const chatRepository = dataSource.getRepository(Chat);

    const chat = await chatRepository.findOne({
      where: { id: chatId },
    });

    let newMessage = messageRepository.create({
      text,
      user,
      chat,
    });

    if (repliedMessageId) {
      const repliedMessage = await messageRepository.findOne({
        where: { id: repliedMessageId },
      });

      newMessage = messageRepository.create({
        text,
        user,
        chat,
        repliedMessage,
      });
    }

    const result = await messageRepository.save(newMessage);

    return result;
  };
  static getMessages = async ({
    chatId,
    userId,
  }: {
    chatId: string;
    userId: string;
  }) => {
    const messages = await dataSource
      .getRepository(Message)
      .createQueryBuilder("message")
      .where("message.userId = :id AND message.chatId = :chatId", {
        id: userId,
        chatId,
      })
      .getMany();

    return messages;
  };
}
