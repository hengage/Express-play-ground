import dotenv from "dotenv";
dotenv.config();

import { app } from "./app/app";
import { PORT, NODE_ENV } from "./config/secrets.config";
import { initializeWebSocket, notificationService } from "./services";

const message = {
    notification: {
      title: 'New message',
      body: 'You have a new message from John',
    },
    token: 'device_token',
  };
notificationService.sendNotification(message)

const server = app.listenToPort(PORT, NODE_ENV);
initializeWebSocket.connectSocket(server)
