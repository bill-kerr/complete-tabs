import firebase from 'firebase/app';
import 'firebase/auth';
import { User } from '../models/User';

export enum FirebaseError {
  InvalidEmail = 'invalid-email',
  EmailInUse = 'email-in-use',
  WeakPassword = 'weak-password',
  UserDisabled = 'user-disabled',
  WrongPassword = 'wrong-password',
  UserNotFound = 'user-not-found',
  ExpiredActionCode = 'expired-action-code',
  InvalidActionCode = 'invalid-action-code',
  TooManyRequests = 'too-many-requests',
  Unknown = 'unknown-error',
}

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyD1msnjlV_4ke583cnXH911B3VifppiPto',
  authDomain: 'complete-tabs.firebaseapp.com',
  projectId: 'complete-tabs',
  storageBucket: 'complete-tabs.appspot.com',
  messagingSenderId: '792511827533',
  appId: '1:792511827533:web:f71822e1b2ce9be04f5604',
  measurementId: 'G-WJ9JH4MZS5',
};

export const mapFirebaseUser = (
  firebaseUser: firebase.User | null,
  token: string | null = null
): User | null => {
  if (!firebaseUser) {
    return null;
  }

  return {
    displayName: firebaseUser.displayName || firebaseUser.email || 'User',
    email: firebaseUser.email!,
    id: firebaseUser.uid,
    token: token || '',
  };
};

export const initializeAuth = () => {
  firebase.initializeApp(FIREBASE_CONFIG);
};

export type AuthUnsubscribe = () => void;
export const onAuthStateChanged = (callback: (user: User | null) => void): AuthUnsubscribe => {
  return firebase.auth().onAuthStateChanged(async user => {
    const token = user ? await user.getIdToken() : '';
    return callback(mapFirebaseUser(user, token));
  });
};

export const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    return null;
  } catch (error) {
    return getFirebaseError(error);
  }
};

export const signOut = () => firebase.auth().signOut();

export const registerUser = async (email: string, password: string) => {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    return null;
  } catch (error) {
    return getFirebaseError(error);
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credentials = await signInWithPopup(provider);
    const token = await getIdToken();
    return mapFirebaseUser(credentials.user, token);
  } catch (error) {
    return null;
  }
};

export const sendPasswordResetEmail = async (emailAddress: string) => {
  try {
    await firebase.auth().sendPasswordResetEmail(emailAddress);
    return null;
  } catch (error) {
    return getFirebaseError(error);
  }
};

export const confirmPasswordReset = async (code: string, newPassword: string) => {
  try {
    await firebase.auth().confirmPasswordReset(code, newPassword);
    return null;
  } catch (error) {
    console.error(error);
    return getFirebaseError(error);
  }
};

export const getFirebaseError = (error: any): FirebaseError => {
  if (!error.code) {
    return FirebaseError.Unknown;
  }

  switch (error.code) {
    case 'auth/invalid-email':
      return FirebaseError.InvalidEmail;
    case 'auth/email-already-in-use':
      return FirebaseError.EmailInUse;
    case 'auth/weak-password':
      return FirebaseError.WeakPassword;
    case 'auth/user-disabled':
      return FirebaseError.UserDisabled;
    case 'auth/user-not-found':
      return FirebaseError.UserNotFound;
    case 'auth/wrong-password':
      return FirebaseError.WrongPassword;
    case 'auth/expired-action-code':
      return FirebaseError.ExpiredActionCode;
    case 'auth/invalid-action-code':
      return FirebaseError.InvalidActionCode;
    case 'auth/too-many-requests':
      return FirebaseError.TooManyRequests;
    default:
      console.error(error);
      return FirebaseError.Unknown;
  }
};

const signInWithPopup = (provider: firebase.auth.AuthProvider) => {
  return firebase.auth().signInWithPopup(provider);
};

const getIdToken = () => {
  const currentUser = firebase.auth().currentUser;
  return currentUser ? currentUser.getIdToken() : null;
};
