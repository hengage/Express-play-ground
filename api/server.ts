import dotenv from 'dotenv';
dotenv.config()

import { app } from "./app/app";
import { PORT, NODE_ENV } from "./config/secrets.config";
import { smsService } from './services';

smsService.sendSms('+233244361405', 'testing sms')



app.listenToPort(PORT, NODE_ENV)