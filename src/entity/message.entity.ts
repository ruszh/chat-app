import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { MessageStatus } from "../constants";

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column()
  text!: string;

  @Column({
    type: "enum",
    enum: MessageStatus,
    default: MessageStatus.Active,
  })
  status!: MessageStatus;
}
