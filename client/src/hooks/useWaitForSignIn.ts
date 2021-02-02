import { useState, useEffect } from 'react';
import { waitForSignIn } from '../utils';

export const useWaitForSignIn = () => {
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    waitForSignIn().then(() => setWaiting(false));
  }, []);

  return waiting;
};
