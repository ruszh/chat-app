import express, { Request, Response, Application, NextFunction } from "express";
import dotenv from "dotenv";
import crypto from "crypto";
// import { Message as MessageType } from "./types";
import { dataSource } from "./app-data-source";
import { Message } from "./entity/message.entity";
dotenv.config();

const app: Application = express();

const port = process.env.PORT || 3000;

// CORS middleware
const allowCrossDomain = (_: Request, res: Response, next: NextFunction) => {
  res.header(`Access-Control-Allow-Origin`, `http://localhost:${port}`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
};

dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

app.use(express.json());

app.use(allowCrossDomain);

app.get("/ping", (_: Request, res: Response) => {
  res.send("Ping");
});

app.post("/message", async (req: Request, res: Response) => {
  const { text } = req.body as { text: string };

  const messageRepository = dataSource.getRepository(Message);
  const newMessage = messageRepository.create({ text });

  const result = await messageRepository.save(newMessage);

  res.send(result);
});

app.get("/message", async (_: Request, res: Response) => {
  const messages = await dataSource.getRepository(Message).find();

  res.send(messages);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
