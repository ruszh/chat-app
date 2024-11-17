import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { User } from "./user.entity";
import { Chat } from "./chat.entity";

@Entity()
export class ChatsUsers {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user)
  user!: User;

  @OneToOne(() => Chat, (chat) => chat)
  chat!: Chat;
}
