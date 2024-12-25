import { dataSource } from "./app-data-source";
import { User } from "../entity/user.entity";
import { Token } from "../entity/token.entity";
import { Chat } from "../entity/chat.entity";
import { ChatsUsers } from "../entity/chatsUsers.entity";
import { Message } from "../entity/message.entity";

export const userRepository = dataSource.getRepository(User);

export const tokenRepository = dataSource.getRepository(Token);

export const chatRepository = dataSource.getRepository(Chat);

export const chatsUsersRepository = dataSource.getRepository(ChatsUsers);

export const messageRepository = dataSource.getRepository(Message);
