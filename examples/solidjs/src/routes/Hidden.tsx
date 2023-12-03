import { CAPTCHA_RESPONSE_KEY, CaptchaFox, CaptchaFoxInstance } from '@captchafox/solid';
import { createSignal } from 'solid-js';
import { BaseLayout } from '../components/BaseLayout';

export type Data = {
  login: string;
  password: string;
  [CAPTCHA_RESPONSE_KEY]: string;
};

export default function Hidden() {
  const [formData, setFormData] = createSignal<Data | undefined>();
  let captchaRef: CaptchaFoxInstance;

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    try {
      const token = (await captchaRef.execute()) ?? 'no-token';

      const data: Data = {
        login: form.login.value,
        password: form.password.value,
        [CAPTCHA_RESPONSE_KEY]: token
      };

      // show data in <pre /> block
      setFormData(data);

      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(data)
      // });

      // if (!response.ok) {
      //   // show an error indicator e.g. a toast
      //   console.error('Error during request. Check logs for more info');
      //   return;
      // }

      // // route to a url or do something else after login
      // const json = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <BaseLayout>
        <div>
          <hgroup>
            <h1>Log in</h1>
            <h2>Login page using CaptchaFox (hidden)</h2>
          </hgroup>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="login"
              placeholder="Login"
              aria-label="Login"
              auto-complete="nickname"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              aria-label="Password"
              auto-complete="current-password"
              required
            />
            <fieldset>
              <CaptchaFox
                ref={captchaRef!}
                mode="hidden"
                sitekey="sk_11111111000000001111111100000000"
              />
            </fieldset>
            <button type="submit">Login</button>
          </form>
          <pre>{JSON.stringify(formData())}</pre>
        </div>
      </BaseLayout>
    </>
  );
}
