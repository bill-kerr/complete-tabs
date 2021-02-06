import { useState, useEffect } from 'react';
import { getOrganizationClaim, onAuthStateChanged } from '../apis/firebase';
import { User } from '../models/User';
import { setExpectSignIn } from '../utils';

export const useAuthState = (initialUser: User | null = null) => {
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(
    () =>
      onAuthStateChanged(newUser => {
        getOrganizationClaim().then(orgId => {
          newUser = newUser ? { ...newUser, organizationId: orgId } : null;
          setUser(newUser);
        });
        setExpectSignIn(!!newUser);
      }),
    [onAuthStateChanged]
  );

  return user;
};
