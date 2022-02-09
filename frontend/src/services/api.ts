import axios, { AxiosError, AxiosInstance } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../context/AuthContext';

let isRefresing = false;
let failedRequestsQueue = [];

export function setupApiClient(ctx = undefined): AxiosInstance {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['nextauth.token']}`,
    },
  });

  api.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      if (error.response.status === 401) {
        if (error.response.data?.code === 'token.expired') {
          cookies = parseCookies(ctx);

          const { 'nextauth.refreshToken': refreshToken } = cookies;
          const originalConfig = error.config;

          if (!isRefresing) {
            isRefresing = true;

            api
              .post('/refresh', { refreshToken })
              .then(({ data: { token, refreshToken: newRefreshToken } }) => {
                setCookie(ctx, 'nextauth.token', token, {
                  maxAge: 60 * 60 * 24,
                  path: '/',
                });

                setCookie(ctx, 'nextauth.refreshToken', newRefreshToken, {
                  maxAge: 60 * 60 * 24,
                  path: '/',
                });

                api.defaults.headers.Authorization = `Bearer ${token}`;

                failedRequestsQueue.forEach(request =>
                  request.onSuccess(token)
                );
                failedRequestsQueue = [];
              })
              .catch(err => {
                failedRequestsQueue.forEach(request => request.onFailure(err));
                failedRequestsQueue = [];

                if (process.env.browser) signOut();
              })
              .finally(() => {
                isRefresing = false;
              });
          }

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers.Authorization = `Bearer ${token}`;

                resolve(api(originalConfig));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        }

        if (process.env.browser) signOut();
      }

      return Promise.reject(error);
    }
  );

  return api;
}
