import dotenv from "dotenv";
dotenv.config();

import { DateTime } from "luxon";

import { app } from "./app/app";
import { PORT, NODE_ENV } from "./config/secrets.config";
import { WebSocket, agenda, redisClient } from "./services";
import { dateTimeSettings } from "./config";
import { walletRepo } from "./components(apps)/wallet/repository/wallet.repo";

const now = DateTime.now().setLocale(dateTimeSettings.defaultLocale);
const formattedDate = now.toLocaleString(DateTime.DATETIME_MED);

console.log(formattedDate);

redisClient.connect();
const server = app.listenToPort(PORT, NODE_ENV);

(async () => {
  await walletRepo.createWalletForVendors();
})();

(async () => {
  await agenda.start();
})();

const InitializeWebSocket = new WebSocket(server);
InitializeWebSocket.connectSocket();
