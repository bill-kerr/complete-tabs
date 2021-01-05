import firebase from 'firebase-admin';
import { BadRequestError, InternalServerError, UnauthorizedError } from './errors';

export enum FirebaseError {
  EMAIL_EXISTS = 'EMAIL_EXISTS',
  INVALID_TOKEN = 'INVALID_TOKEN',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  UNKNOWN = 'UNKNOWN',
}

export function initFirebase() {
  firebase.initializeApp({ credential: firebase.credential.applicationDefault() });
  console.log('Firebase initialized.');
}

export async function verifyToken(token: string) {
  try {
    return mapUser(await firebase.auth().verifyIdToken(token));
  } catch (error) {
    handleFirebaseError(error);
  }
}

function mapUser(firebaseUser: firebase.auth.DecodedIdToken | firebase.auth.UserRecord) {
  return { id: firebaseUser.uid, email: firebaseUser.email || '' };
}

export function handleFirebaseError(error: any): never {
  const firebaseError = isFirebaseError(error) ? error : getFirebaseError(error);
  switch (firebaseError) {
    case FirebaseError.EMAIL_EXISTS:
      throw new BadRequestError('A user with that email already exists.');
    case FirebaseError.INVALID_TOKEN:
      throw new UnauthorizedError('Invalid access token.');
    case FirebaseError.EXPIRED_TOKEN:
      throw new UnauthorizedError('The access token has expired.');
    default:
      throw new InternalServerError(error);
  }
}

function isFirebaseError(error: any): error is FirebaseError {
  return error in FirebaseError;
}

export function getFirebaseError(error: any): FirebaseError {
  switch (error.code) {
    case 'auth/email-already-exists':
      return FirebaseError.EMAIL_EXISTS;
    case 'auth/invalid-id-token':
      return FirebaseError.INVALID_TOKEN;
    case 'auth/id-token-expired':
      return FirebaseError.EXPIRED_TOKEN;
    default:
      return FirebaseError.UNKNOWN;
  }
}
