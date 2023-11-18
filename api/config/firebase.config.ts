// const admin = require('firebase-admin');
import * as admin from "firebase-admin";

const serviceAccount = require("./mr-delivery-ghana-d2aa0-firebase-adminsdk-qune8-77567bd46c.json");

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
