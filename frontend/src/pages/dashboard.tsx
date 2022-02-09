import { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export default function Dashboard(): JSX.Element {
  const { user } = useAuthContext();

  useEffect(() => {
    api.get('/me').then(({ data }) => {
      console.log('data: ', data);
    });
  }, []);

  return <h1>dashboard: {user?.email}</h1>;
}
