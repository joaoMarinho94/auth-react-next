/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import decode from 'jwt-decode';
import { parseCookies, setCookie } from 'nookies';
import { AuthTokenError } from '../services/errors/AuthTokenError';
import { validateUserPermissions } from './validateUserPermissions';

type withSSRAuthOptions = {
  permissions: string[];
  roles: string[];
};

export function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options?: withSSRAuthOptions
): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const token = cookies['nextauth.token'];

    if (!cookies['nextauth.token']) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    if (options) {
      const user = decode<{ permissions: string[]; roles: string[] }>(token);
      const { permissions, roles } = options;

      const userHasValidPermissions = validateUserPermissions({
        user,
        permissions,
        roles,
      });

      if (!userHasValidPermissions) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false,
          },
        };
      }
    }

    try {
      return await fn(ctx);
    } catch (error) {
      if (error instanceof AuthTokenError) {
        setCookie(ctx, 'nextauth.token', '', {
          maxAge: 0,
          path: '/',
        });
        setCookie(ctx, 'nextauth.refreshToken', '', {
          maxAge: 0,
          path: '/',
        });

        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    }
  };
}
