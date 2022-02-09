import { createContext, ReactNode, useContext } from 'react';
import { api } from '../services/api';

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credential: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const isAuthenticated = false;

  async function signIn({ email, password }: SignInCredentials): Promise<void> {
    try {
      const { data } = await api.post('sessions', { email, password });
      console.log('data: ', data);
    } catch (error) {
      console.log('error: ', error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = (): AuthContextData => useContext(AuthContext);
