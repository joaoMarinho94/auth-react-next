import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { FormEvent, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import styles from '../styles/home.module.scss';
import { withSSRGuest } from '../utils/withSSRGuest';

export default function Home(): JSX.Element {
  const { signIn } = useAuthContext();

  const [email, setEmail] = useState('diego@rocketseat.team');
  const [password, setPassword] = useState('123456');

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();

    const data = { email, password };

    await signIn(data);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}

export const getServerSideProps = withSSRGuest(async ctx => {
  return {
    props: {},
  };
});
