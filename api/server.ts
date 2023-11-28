import dotenv from "dotenv";
dotenv.config();

import { app } from "./app/app";
import { PORT, NODE_ENV } from "./config/secrets.config";
import { WebSocket, redisClient } from "./services";


redisClient.connect()

const server = app.listenToPort(PORT, NODE_ENV);

const InitializeWebSocket = new WebSocket(server)
InitializeWebSocket.connectSocket()

