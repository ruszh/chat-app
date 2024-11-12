import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { MessageStatus } from "../constants";
import { User } from "./user.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  text!: string;

  @ManyToOne(() => User, (user) => user)
  user!: User;

  @Column({
    type: "enum",
    enum: MessageStatus,
    default: MessageStatus.Active,
  })
  status!: MessageStatus;
}
