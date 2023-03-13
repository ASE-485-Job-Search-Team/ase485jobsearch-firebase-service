const firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyDsmYeBEq0pIS08uZLvO2wBedwcotJZQ-Y",
    authDomain: "jobhive-66671.firebaseapp.com",
    projectId: "jobhive-66671",
    storageBucket: "jobhive-66671.appspot.com",
    messagingSenderId: "747233347595",
    appId: "1:747233347595:web:e66e0b40791584bef35f0e",
    measurementId: "G-MDBREXZYR5"
  };
  
firebase.initializeApp(firebaseConfig); //initialize firebase app 
module.exports = { firebase }; //export the app