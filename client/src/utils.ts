import qs from 'query-string';
import { onAuthStateChanged } from './apis/firebase';
import { EXPECT_SIGN_IN_KEY, EXPECT_SIGN_IN_TIMEOUT, SignInStatus } from './constants';

export const parseQuery = (queryString: string) => qs.parse(queryString);

export const expectSignIn = (): boolean => {
  const value = localStorage.getItem(EXPECT_SIGN_IN_KEY);
  return value === SignInStatus.EXPECT_SIGN_IN;
};

export const setExpectSignIn = (expectSignIn: boolean) => {
  const value = expectSignIn ? SignInStatus.EXPECT_SIGN_IN : SignInStatus.DO_NOT_EXPECT_SIGN_IN;
  localStorage.setItem(EXPECT_SIGN_IN_KEY, value);
};

export const waitForSignIn = (): Promise<void> => {
  return new Promise(resolve => {
    if (!expectSignIn()) {
      resolve();
    }
    onAuthStateChanged(() => resolve());
    setTimeout(async () => resolve(), EXPECT_SIGN_IN_TIMEOUT);
  });
};
