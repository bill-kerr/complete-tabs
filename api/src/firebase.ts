import firebase from 'firebase-admin';
import { User } from './domain/auth/user.entity';
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
    const decodedToken = await firebase.auth().verifyIdToken(token);
    return mapDecodedToken(decodedToken);
  } catch (error) {
    handleFirebaseError(error);
  }
}

function mapDecodedToken(token: firebase.auth.DecodedIdToken): User {
  const user = new User();
  user.email = token.email || '';
  user.id = token.uid;
  return user;
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
