import { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useCan } from '../hooks/useCan';
import { setupApiClient } from '../services/api';
import { api } from '../services/apiClient';
import { withSSRAuth } from '../utils/withSSRAuth';

export default function Dashboard(): JSX.Element {
  const { user } = useAuthContext();

  const userCanSeeMetrics = useCan({ permissions: ['metrics.list'] });

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

      {userCanSeeMetrics && <div>Métricas</div>}
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
