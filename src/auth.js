import { auth } from "./firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";


export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  console.log(user);

  // add user to firestore
};

export const doSignOut = () => {
  return auth.signOut();
};
