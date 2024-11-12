import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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

  @Column()
  password!: string;
}
