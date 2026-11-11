import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, type Connect, type Plugin } from 'vite';

/**
 * Stand-in for your backend so the plain HTML form in the "Basic" example has somewhere to post.
 * It only echoes what it received. A real endpoint must verify the `cf-captcha-response` token
 * server-side, e.g. with `@captchafox/node`.
 */
const mockLoginApi = (): Plugin => {
  const handler: Connect.NextHandleFunction = (req, res, next) => {
    if (req.method !== 'POST' || req.url !== '/api/login') return next();

    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const received = Object.fromEntries(new URLSearchParams(body));
      if (received.password) received.password = '***';

      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify(
          {
            message: 'Mock /api/login: verify the cf-captcha-response token on your server.',
            received
          },
          null,
          2
        )
      );
    });
  };

  return {
    name: 'mock-login-api',
    configureServer: (server) => void server.middlewares.use(handler),
    configurePreviewServer: (server) => void server.middlewares.use(handler)
  };
};

export default defineConfig({
  plugins: [svelte(), mockLoginApi()]
});
