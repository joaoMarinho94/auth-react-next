import { useEffect } from 'react';
import { Can } from '../components/Can';
import { useAuthContext } from '../context/AuthContext';
import { setupApiClient } from '../services/api';
import { api } from '../services/apiClient';
import { withSSRAuth } from '../utils/withSSRAuth';

export default function Dashboard(): JSX.Element {
  const { user, signOut } = useAuthContext();

  useEffect(() => {
    api
      .get('/me')
      .then(({ data }) => {
        console.log('data: ', data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <h1>dashboard: {user?.email}</h1>

      <button type="button" onClick={signOut}>
        Sign out
      </button>

      <Can permissions={['metrics.list']}>
        <div>Métricas</div>
      </Can>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async ctx => {
  const apiClient = setupApiClient(ctx);
  const { data } = await apiClient.get('/me');
  console.log('data: ', data);

  return {
    props: {},
  };
});
