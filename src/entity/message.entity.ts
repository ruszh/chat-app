import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { MessageStatus } from "../constants";
import { User } from "./user.entity";
import { Chat } from "./chat.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  text!: string;

  @ManyToOne(() => User, (user) => user)
  user!: User;

  @ManyToOne(() => User, (user) => user)
  forwardedFromUser!: User;

  @ManyToOne(() => Chat, (chat) => chat)
  forwardedFromChat!: Chat;

  @ManyToOne(() => Chat, (chat) => chat)
  chat!: Chat;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @OneToOne(() => Message, (message) => message)
  repliedMessage!: Message;

  @Column({
    type: "enum",
    enum: MessageStatus,
    default: MessageStatus.Active,
  })
  status!: MessageStatus;
}
