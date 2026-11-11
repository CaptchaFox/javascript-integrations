<script lang="ts">
  import {
    CAPTCHA_RESPONSE_KEY,
    CaptchaFox,
    RetryError,
    TimeoutError,
    type CaptchaFoxInstance
  } from '@captchafox/svelte';
  import BaseLayout from '../components/BaseLayout.svelte';

  type Data = {
    login: string;
    password: string;
    [CAPTCHA_RESPONSE_KEY]: string;
  };

  let captcha = $state<CaptchaFoxInstance>();
  let formData = $state<Data>();
  let errorMessage = $state<string>();

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    errorMessage = undefined;

    const form = new FormData(event.currentTarget as HTMLFormElement);

    try {
      // execute() waits for the widget if it is still loading
      const token = (await captcha?.execute()) ?? 'no-token';

      // show data in <pre /> block
      formData = {
        login: String(form.get('login')),
        password: String(form.get('password')),
        [CAPTCHA_RESPONSE_KEY]: token
      };

      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
    } catch (error) {
      if (error instanceof TimeoutError) {
        errorMessage = 'The captcha took too long to load. Please try again.';
      } else if (error instanceof RetryError) {
        errorMessage = 'Verification failed. Please try again.';
      } else {
        errorMessage = `Verification was not completed (${String(error)}).`;
      }
    }
  };
</script>

<BaseLayout>
  <div>
    <hgroup>
      <h1>Log in</h1>
      <h2>Login page using CaptchaFox (hidden)</h2>
    </hgroup>
    <form onsubmit={handleSubmit}>
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
        <CaptchaFox bind:this={captcha} mode="hidden" sitekey="sk_11111111000000001111111100000000" />
      </fieldset>
      <button type="submit">Login</button>
    </form>
    {#if errorMessage}
      <p role="alert">{errorMessage}</p>
    {/if}
    <pre>{formData ? JSON.stringify(formData) : ''}</pre>
  </div>
</BaseLayout>
