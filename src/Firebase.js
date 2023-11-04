// Import the functions you need from the SDKs you need
import { id } from 'date-fns/locale';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getMessaging, getToken } from "firebase/messaging";
import { useState } from 'react';



const firebaseConfig = {
  apiKey: "AIzaSyB_rz4JjGqAn898Ysb1uirizOyBDqIMdIU",
  authDomain: "audioryauth.firebaseapp.com",
  projectId: "audioryauth",
  storageBucket: "audioryauth.appspot.com",
  messagingSenderId: "1067039909340",
  appId: "1:1067039909340:web:b020bbce26632e66961b19",
  measurementId: "G-LM1E70EQHC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

if (typeof window !== "undefined") {
  // browser code
  const analytics = getAnalytics(app);
  const messaging = getMessaging(app);
  // getToken(messaging, {
  //   vapidKey: "BEOE9H50LMurPvjrOp7cEMyZK6eChq9W2BQ_mSl4tEfAC-SDNUDB_Flikrl7Zm9d-NsDklu17_mlUzxV_nmlnAE"
  // }).then((currentToken) => {
  //   if (currentToken) {
  //     console.log(
  //       'fmc token', currentToken
  //     )
  //     // Send the token to your server and update the UI if necessary
  //     // ...
  //   } else {
  //     // Show permission request UI
  //     console.log('No registration token available. Request permission to generate one.');
  //     // ...
  //   }
  // }).catch((err) => {
  //   console.log('An error occurred while retrieving token. ', err);
  //   // ...
  // });



}
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGooglePopup = async () => {
  var idToken = '';
  await signInWithPopup(auth, provider).then((result) => {
    console.log('result login google', result);

    const gUser = result.user;
    gUser.getIdTokenResult().then((res) => {
      idToken = res.token;
    })
  }).catch((err) => {
    console.log(err)
  }).finally(() => {
  })

  return idToken;


}