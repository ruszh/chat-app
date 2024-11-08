import dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

export const dataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || "3307"),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: ["src/entity/*.ts"],
  logging: true,
  synchronize: true,
});
