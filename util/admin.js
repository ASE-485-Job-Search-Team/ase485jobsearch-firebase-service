var admin = require("firebase-admin");
var {getStorage,ref, uploadBytes} = require('firebase-admin/storage')
var serviceAccount = require("./jobhive-66671-firebase-adminsdk-a0p0g-044d015562.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "jobhive-66671.appspot.com",
});

const bucket = getStorage().bucket();
const db = admin.firestore();
module.exports = { admin, db ,bucket};