import { useState, useEffect } from 'react';
import { onAuthStateChanged } from '../apis/firebase';
import { User } from '../models/User';

export const useAuthState = (initialUser: User | null = null) => {
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => onAuthStateChanged(newUser => setUser(newUser)), [onAuthStateChanged]);

  return user;
};
