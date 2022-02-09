import { useAuthContext } from '../context/AuthContext';

export default function Dashboard(): JSX.Element {
  const { user } = useAuthContext();

  return <h1>dashboard: {user?.email}</h1>;
}
