import { createContext, ReactNode, useContext, useState } from 'react';
import Router from 'next/router';
import { api } from '../services/api';

type User = {
  email: string;
  permission: string[];
  roles: string[];
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credential: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  async function signIn({ email, password }: SignInCredentials): Promise<void> {
    try {
      const {
        data: { permission, roles, token, refreshToken },
      } = await api.post('sessions', { email, password });

      setUser({
        email,
        permission,
        roles,
      });

      Router.push('/dashboard');
    } catch (error) {
      console.log('error: ', error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = (): AuthContextData => useContext(AuthContext);
