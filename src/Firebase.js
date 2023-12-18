import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB_rz4JjGqAn898Ysb1uirizOyBDqIMdIU',
  authDomain: 'audioryauth.firebaseapp.com',
  projectId: 'audioryauth',
  storageBucket: 'audioryauth.appspot.com',
  messagingSenderId: '1067039909340',
  appId: '1:1067039909340:web:b020bbce26632e66961b19',
  measurementId: 'G-LM1E70EQHC',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGooglePopup = async () => {
  let idToken = '';
  await signInWithPopup(auth, provider)
    .then((result) => {
      console.log('result login google', result);

      const gUser = result.user;
      gUser.getIdTokenResult().then((res) => {
        idToken = res.token;
      });
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {});

  return idToken;
};
