import { app } from "./app/app";
import { PORT, NODE_ENV } from "./config/secrets.config";

app.listenToPort(PORT, NODE_ENV)