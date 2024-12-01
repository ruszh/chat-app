import "./types/express";
import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import { dataSource } from "./app-data-source";
import { allowCrossDomain } from "./middlewares";
import { port } from "./constants";
import cookieParser from "cookie-parser";
import { authRoutes, protectedRoutes } from "./routes";

dotenv.config();

const app: Application = express();

dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

app.use(express.json());
app.use(cookieParser());
app.use(allowCrossDomain);

app.get("/ping", (_: Request, res: Response) => {
  res.send("Ping");
});

app.use("/auth", authRoutes);
app.use("", protectedRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
