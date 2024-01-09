<script setup lang="ts">
import { CaptchaFox } from '@captchafox/vue';
import { ref } from 'vue';
import BaseLayout from '../components/BaseLayout.vue';

const isVerified = ref(false);
</script>

<template>
  <BaseLayout>
    <div>
      <hgroup>
        <h1>Log in</h1>
        <h2>Login page using CaptchaFox</h2>
      </hgroup>
      <form
        method="POST"
        action="/api/login"
      >
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
            ref="comp"
            sitekey="sk_11111111000000001111111100000000"
            theme="dark"
            @verify="() => isVerified = true"
          />
        </fieldset>
        <button
          type="submit"
          :disabled="!isVerified"
        >
          Login
        </button>
      </form>
    </div>
  </BaseLayout>
</template>
