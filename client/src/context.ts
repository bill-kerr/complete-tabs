import React from 'react';
import { User } from './models/User';

export const AuthContext = React.createContext<User | null>(null);
