import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./user.entity";
import { Chat } from "./chat.entity";

@Entity()
export class ChatsUsers {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user)
  user!: User;

  @ManyToOne(() => Chat, (chat) => chat)
  chat!: Chat;
}
