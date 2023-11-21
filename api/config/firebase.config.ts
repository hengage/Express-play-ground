// const admin = require('firebase-admin');
const fs = require('fs');

import * as admin from "firebase-admin";


const filePath = process.env.FIREBASE_ADMIN_SDK_KEY_MrD;

if (!filePath) {
  console.error("FIREBASE_ADMIN_SDK_KEY_MrD environment variable is not set.");
  process.exit(1);
}

// Read the content of the file
const serviceAccountJson = fs.readFileSync(filePath, 'utf8');

console.log("Raw content of FIREBASE_ADMIN_SDK_KEY_MrD:", serviceAccountJson);
const serviceAccount = JSON.parse(serviceAccountJson)

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
