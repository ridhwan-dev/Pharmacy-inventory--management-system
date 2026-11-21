
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { auth } from './firebase';

// Register a new user
export function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Log in an existing user
export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Sign in using Google
const googleProvider = new GoogleAuthProvider();

export function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

// Log out the current user
export function logoutUser() {
  return signOut(auth);
}
