import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { MessageStatus } from "../constants";
import { User } from "./user.entity";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @ManyToOne(() => User, (user) => user)
  creator!: User;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;
}
