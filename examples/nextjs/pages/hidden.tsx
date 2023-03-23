import { Layout } from '@/components/Layout';
import { CaptchaFox, CaptchaFoxInstance, CAPTCHA_RESPONSE_KEY } from '@captchafox/react';
import Head from 'next/head';
import { FormEvent, useRef } from 'react';
import { toast } from 'react-toastify';
import { Data } from '../model/form.model';

export default function Basic() {
  const captchaRef = useRef<CaptchaFoxInstance | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    const form = event.currentTarget;

    try {
      const token = (await captchaRef.current?.execute()) ?? 'no-token';

      const data: Data = {
        login: form.login.value,
        password: form.password.value,
        remember: form.remember.value,
        [CAPTCHA_RESPONSE_KEY]: token
      };

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        // show an error indicator e.g. a toast
        toast('Error during request. Check logs for more info', { type: 'error' });
        return;
      }

      // route to dashboard or do something else after login
      const json = await response.json();
      console.log('Login', json);
    } catch (error) {
      toast('Error during request', { type: 'error' });
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>CaptchaFox React</title>
      </Head>
      <Layout>
        <div>
          <hgroup>
            <h1>Sign in</h1>
            <h2>Login page using CaptchaFox (hidden)</h2>
          </hgroup>
          <form onSubmit={handleSubmit}>
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
                ref={captchaRef}
                mode="hidden"
                sitekey="sk_11111111000000001111111100000000"
              />
            </fieldset>
            <button type="submit">Login</button>
          </form>
        </div>
        <div />
      </Layout>
    </>
  );
}
