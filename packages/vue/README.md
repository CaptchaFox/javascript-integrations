# @captchafox/vue

[![NPM version](https://img.shields.io/npm/v/@captchafox/vue.svg)](https://www.npmjs.com/package/@captchafox/vue)

## Installation

Install the library using your prefered package manager

```sh
npm install @captchafox/vue
```

```sh
yarn add @captchafox/vue
```

```sh
pnpm add @captchafox/vue
```

```sh
bun add @captchafox/vue
```

## Usage

```vue
<script setup lang="ts">
import { CaptchaFox } from '@captchafox/vue';
</script>

<template>
    <CaptchaFox sitekey="sk_11111111000000001111111100000000" />
</template>
```

(Optional) Register it for the whole app (e.g. `main.ts`)

```ts
import { CaptchaFox } from '@captchafox/vue';
import App from './App.vue';

const app = createApp(App)
    .component('CaptchaFox', CaptchaFox);
    .mount('#app');
```

### Props

| **Prop** | **Type**                | **Description**                                                                 | **Required** |
| -------- | ----------------------- | ------------------------------------------------------------------------------- | ------------ |
| sitekey  | `string`                | The sitekey for the widget                                                      | ✅            |
| lang     | `string`                | The language the widget should display. Defaults to automatically detecting it. |              |
| mode     | `inline\|popup\|hidden` | The mode the widget should be displayed in .                                    |              |
| onVerify | `function`              | Called with the response token after successful verification.                   |              |
| onFail   | `function`              | Called after unsuccessful verification.                                         |              |
| onError  | `function`              | Called when an error occured.                                                   |              |
| onExpire | `function`              | Called when the challenge expires.                                              |              |
| onClose  | `function`              | Called when the challenge was closed.                                           |              |

### Using the verification callback

```vue
<script setup lang="ts">
import { CaptchaFox, CAPTCHA_RESPONSE_KEY } from '@captchafox/vue';

const handleVerify = (token: string) => {
    // do something with the token here (e.g. submit the form)
    const formData = {
        // your form data
        [CAPTCHA_RESPONSE_KEY]: token
    };
}
</script>

<template>
    <CaptchaFox 
        sitekey="sk_11111111000000001111111100000000" 
        @verify="handleVerify"
    />
</template>
```

### Using v-model

```vue
<script setup lang="ts">
import { CaptchaFox, CAPTCHA_RESPONSE_KEY } from '@captchafox/vue';

// contains response token after successful verification
const token = ref<string>();
</script>

<template>
    <CaptchaFox 
        sitekey="sk_11111111000000001111111100000000" 
        v-model="token"
    />
    <pre>{{ token }}</pre>
</template>
```

### Interacting with the instance

```vue
<script setup lang="ts">
import { CAPTCHA_RESPONSE_KEY, CaptchaFox, CaptchaFoxInstance } from '@captchafox/vue';
import { ref } from 'vue';

const captchafox = ref<CaptchaFoxInstance | null>(null);

const triggerAction = async () => {
    // execute the captcha
    try {
        const token = await captchafox.value?.execute()
    } catch {
        // unsuccessful verification
    }
}
</script>

<template>
    <CaptchaFox
        ref="captchafox"
        sitekey="sk_11111111000000001111111100000000"
    />
    <button @click="triggerAction">Action</button>
</template>
```

You can find more detailed examples in the [GitHub repository](https://github.com/CaptchaFox/javascript-integrations/tree/main/examples/vue).
