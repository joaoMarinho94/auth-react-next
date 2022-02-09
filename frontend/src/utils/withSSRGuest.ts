/* eslint-disable no-return-await */
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { parseCookies } from 'nookies';

export function withSSRGuest<P>(fn: GetServerSideProps<P>): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    if (cookies['nextauth.token']) {
      return {
        redirect: {
          destination: '/dasboard',
          permanent: false,
        },
      };
    }

    return await fn(ctx);
  };
}
