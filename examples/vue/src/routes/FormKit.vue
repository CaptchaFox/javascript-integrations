<script setup lang="ts">
import { CAPTCHA_RESPONSE_KEY } from '@captchafox/vue';
import { ref } from 'vue';
import BaseLayout from '../components/BaseLayout.vue';
import { captcha } from '../components/formKit/customInputs';
import { Data } from '../model/form';

const formData = ref();

const onSubmit = (fields: Data) => {
  formData.value = fields;
}
</script>

<template>
  <BaseLayout>
    <div>
      <hgroup>
        <h1>Log in</h1>
        <h2>Login page using CaptchaFox</h2>
      </hgroup>
      <FormKit
        type="form"
        submit-label="Login"
        @submit="onSubmit"
      >
        <FormKit
          type="text"
          name="login"
          placeholder="Login"
          aria-label="Login"
          auto-complete="nickname"
          validation="required"
        />
        <FormKit
          type="password"
          name="password"
          placeholder="Password"
          aria-label="Password"
          auto-complete="current-password"
          validation="required"
        />
        <fieldset>
          <FormKit
            :type="captcha"
            :name="CAPTCHA_RESPONSE_KEY"
            sitekey="sk_11111111000000001111111100000000"
            validation="required"
          />
        </fieldset>
        <pre>{{ formData }}</pre>
      </FormKit>
    </div>
  </BaseLayout>
</template>
