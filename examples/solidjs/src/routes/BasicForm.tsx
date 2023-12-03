import { CaptchaFox } from '@captchafox/solid';
import { createSignal } from 'solid-js';
import { BaseLayout } from '../components/BaseLayout';

export default function Basic() {
  const [isVerified, setVerified] = createSignal(false);

  return (
    <>
      <BaseLayout>
        <div>
          <hgroup>
            <h1>Log in</h1>
            <h2>Login page using CaptchaFox</h2>
          </hgroup>
          {/* Replace the action with your own API route */}
          <form method="post" action="/api/login">
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
              <label html-for="remember">
                <input type="checkbox" role="switch" id="remember" name="remember" />
                Remember me
              </label>
            </fieldset>
            <fieldset>
              <CaptchaFox
                sitekey="sk_11111111000000001111111100000000"
                onVerify={() => setVerified(true)}
              />
            </fieldset>
            <button type="submit" disabled={!isVerified}>
              Login
            </button>
          </form>
        </div>
      </BaseLayout>
    </>
  );
}
