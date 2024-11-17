import {
  Entity,
  CreateDateColumn,
  Column,
  PrimaryGeneratedColumn,
} from "typeorm";

import { IsEmail } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userName!: string;

  @Column()
  @IsEmail()
  email!: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @Column()
  password!: string;
}
