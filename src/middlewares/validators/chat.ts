import { NextFunction, Response, Request } from "express";
import { dataSource } from "../../lib/app-data-source";
import { Chat } from "../../entity/chat.entity";
import { ChatsUsers } from "../../entity/chatsUsers.entity";
import { User } from "../../entity/user.entity";
import { mapUserData } from "../../utils/common";
import {
  chatRepository,
  userRepository,
  chatsUsersRepository,
} from "../../lib/repositories";

export const createChatValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.body as { title: string };

  if (!title) {
    res.status(400).send("Title is required");
    return;
  }

  next();
};

export const inviteUserToChatValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: chatId } = req.params;

  const { userId } = req.body as { userId: string };

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

  next();
};

export const updateChatValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { title } = req.body as { title: string };

  if (!title) {
    res.status(400).send("Title is required");
    return;
  }

  const chat = await chatRepository.findOne({
    relations: { creator: true },
    where: { id, creator: mapUserData(req.user) },
  });

  if (!chat) {
    res.status(404).send({ message: "Chat not found" });
    return;
  }

  next();
};

export const deleteChatValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const chat = await chatRepository.findOne({
    relations: { creator: true },
    where: { id, creator: mapUserData(req.user) },
  });

  if (!chat) {
    res.status(404).send({ message: "Chat not found" });
    return;
  }

  next();
};
