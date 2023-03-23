import Head from 'next/head';
import { CaptchaFox, CAPTCHA_RESPONSE_KEY } from '@captchafox/react';
import { Layout } from '@/components/Layout';
import { Controller, useForm } from 'react-hook-form';
import { Data } from '../model/form.model';
import { toast } from 'react-toastify';

export default function HookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control
  } = useForm<Data>();

  const onSubmit = async (data: Data): Promise<void> => {
    console.log('formData', data);
    try {
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
            <h2>Login page using CaptchaFox</h2>
          </hgroup>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder="Login"
              aria-label="Login"
              autoComplete="nickname"
              {...(errors.login && { 'aria-invalid': true })}
              {...register('login', { required: true })}
            />
            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              autoComplete="current-password"
              {...(errors.password && { 'aria-invalid': true })}
              {...register('password', { required: true })}
            />
            <fieldset>
              <label htmlFor="remember">
                <input type="checkbox" role="switch" id="remember" {...register('remember')} />
                Remember me
              </label>
            </fieldset>
            <fieldset>
              {/* turn the CaptchaFox component into a react-hook-form input field */}
              <Controller
                name={CAPTCHA_RESPONSE_KEY}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange } }) => (
                  <CaptchaFox
                    sitekey="sk_11111111000000001111111100000000"
                    onVerify={(token) => onChange(token)}
                  />
                )}
              />
            </fieldset>
            <button type="submit" aria-busy={isSubmitting}>
              Login
            </button>
          </form>
        </div>
        <div />
      </Layout>
    </>
  );
}
