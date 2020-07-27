import express from "express";
const server = express();
import listEndPoints from "express-list-endpoints";
import compression from "compression";
import passport from "passport";
import { httpLogger } from "./middleware";
import { logger } from "./utils";
import "./utils/authUtils";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectMongoose from "./db/mongooseConnection";
import {
  authRouter,
  userRouter,
  taskRouter,
  developerTaskRouter,
} from "./route";

server.use(cors());
server.use(compression()); // for performance
server.use(httpLogger);
server.use(passport.initialize());
server.use(express.json());

const PORT = process.env.PORT || 5500;

server.use("/api/auth", authRouter);
server.use("/api/user", userRouter);
server.use("/api/developertask", developerTaskRouter);
server.use("/api/task", taskRouter);

server.get("/", (req, res) => {
  res.send("App is Alive!");
});
console.log(listEndPoints(server));

server.listen(PORT, () => {
  logger.info(`We are live on ${PORT}`);
  connectMongoose();
});
