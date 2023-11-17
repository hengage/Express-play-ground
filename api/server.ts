import dotenv from "dotenv";
dotenv.config();

import { app } from "./app/app";
import { PORT, NODE_ENV } from "./config/secrets.config";
import { initializeWebSocket } from "./services";



const server = app.listenToPort(PORT, NODE_ENV);
initializeWebSocket.connectSocket(server)
