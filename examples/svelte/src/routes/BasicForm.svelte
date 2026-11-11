<script lang="ts">
  import { CaptchaFox } from '@captchafox/svelte';
  import BaseLayout from '../components/BaseLayout.svelte';

  let isVerified = $state(false);
</script>

<BaseLayout>
  <div>
    <hgroup>
      <h1>Log in</h1>
      <h2>Login page using CaptchaFox</h2>
    </hgroup>
    <!-- Posts to a mock endpoint (see vite.config.ts). Replace the action with your own API route. -->
    <form method="post" action="/api/login">
      <input
        type="text"
        name="login"
        placeholder="Login"
        aria-label="Login"
        autocomplete="nickname"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        aria-label="Password"
        autocomplete="current-password"
        required
      />
      <fieldset>
        <label for="remember">
          <input type="checkbox" role="switch" id="remember" name="remember" />
          Remember me
        </label>
      </fieldset>
      <fieldset>
        <CaptchaFox
          sitekey="sk_11111111000000001111111100000000"
          onVerify={() => (isVerified = true)}
          onExpire={() => (isVerified = false)}
        />
      </fieldset>
      <button type="submit" disabled={!isVerified}>Login</button>
    </form>
  </div>
</BaseLayout>
