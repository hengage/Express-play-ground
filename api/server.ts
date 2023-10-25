import dotenv from "dotenv";
dotenv.config();

import { app } from "./app/app";
import { PORT, NODE_ENV } from "./config/secrets.config";
import { smsService } from "./services";



app.listenToPort(PORT, NODE_ENV);
