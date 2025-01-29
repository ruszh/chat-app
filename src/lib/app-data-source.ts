import dotenv from "dotenv";

import { DataSource } from "typeorm";
import { User } from "../entity/user.entity";
import { Chat } from "../entity/chat.entity";
import { Message } from "../entity/message.entity";
import { ChatsUsers } from "../entity/chatsUsers.entity";
import { Token } from "../entity/token.entity";

dotenv.config();

export const dataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || "3307"),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [User, Chat, Message, ChatsUsers, Token],
  synchronize: true,
});
