<script setup lang="ts">
import { CAPTCHA_RESPONSE_KEY, CaptchaFox, CaptchaFoxInstance } from '@captchafox/vue';
import { ref } from 'vue';
import BaseLayout from '../components/BaseLayout.vue';
import type { Data } from '../model/form';

const formData = ref();
const captchafox = ref<CaptchaFoxInstance | null>(null);

const onSubmit = async (event: Event) => {
  const form = event.currentTarget as HTMLFormElement;
  try {
    const token = (await captchafox.value?.execute()) ?? 'no-token';

    const data: Data = {
      login: form.login.value,
      password: form.password.value,
      remember: form.remember.value,
      [CAPTCHA_RESPONSE_KEY]: token
    };

    // show data in <pre /> block
    formData.value = data;

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
    // console.log('Login', json);
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <BaseLayout>
    <div>
      <hgroup>
        <h1>Log in</h1>
        <h2>Login page using CaptchaFox</h2>
      </hgroup>
      <form @submit.prevent="onSubmit">
        <input
          type="text"
          name="login"
          placeholder="Login"
          aria-label="Login"
          auto-complete="nickname"
          required
        >
        <input
          type="password"
          name="password"
          placeholder="Password"
          aria-label="Password"
          auto-complete="current-password"
          required
        >
        <fieldset>
          <label html-for="remember">
            <input
              id="remember"
              type="checkbox"
              role="switch"
              name="remember"
            >
            Remember me
          </label>
        </fieldset>
        <fieldset>
          <CaptchaFox
            ref="captchafox"
            mode="hidden"
            sitekey="sk_11111111000000001111111100000000"
          />
        </fieldset>
        <button type="submit">
          Login
        </button>
      </form>
      <pre>{{ formData }}</pre>
    </div>
  </BaseLayout>
</template>
