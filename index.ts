import express, { Request, Response, Application, NextFunction } from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import bodyParser from "body-parser";
dotenv.config();

const app: Application = express();

const port = process.env.PORT || 3000;

type Message = { text: string; id: string };

// CORS middleware
const allowCrossDomain = (_: Request, res: Response, next: NextFunction) => {
  res.header(`Access-Control-Allow-Origin`, `http://localhost:${port}`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
};

const messages: Message[] = [];

app.use(bodyParser.json());

app.use(allowCrossDomain);

app.get("/ping", (_: Request, res: Response) => {
  res.send("Ping");
});

app.post("/message", (req: Request, res: Response) => {
  const { text } = req.body as { text: string };
  const newMessage = { text, id: crypto.randomUUID() };

  messages.push(newMessage);

  res.send(newMessage);
});

app.get("/message", (_: Request, res: Response) => {
  res.send(messages);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
