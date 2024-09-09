import { Layout } from '@/components/Layout';
import { CaptchaFox } from '@captchafox/react';
import Head from 'next/head';
import { useState } from 'react';

export default function Basic() {
  const [isVerified, setVerified] = useState(false);

  return (
    <>
      <Head>
        <title>CaptchaFox React</title>
      </Head>
      <Layout>
        <div>
          <hgroup>
            <h1>Log in</h1>
            <h2>Login page using CaptchaFox</h2>
          </hgroup>
          <form method="POST" action="/api/login">
            <input
              type="text"
              name="login"
              placeholder="Login"
              aria-label="Login"
              autoComplete="nickname"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              aria-label="Password"
              autoComplete="current-password"
              required
            />
            <fieldset>
              <label htmlFor="remember">
                <input type="checkbox" role="switch" id="remember" name="remember" />
                Remember me
              </label>
            </fieldset>
            <fieldset>
              <CaptchaFox
                sitekey="sk_11111111000000001111111100000000"
                theme="dark"
                onVerify={() => setVerified(true)}
                i18n={{ en: { initial: 'Please start the test' } }}
              />
            </fieldset>
            <button type="submit" disabled={!isVerified}>
              Login
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
}
