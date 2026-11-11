# @captchafox/svelte

[![NPM version](https://img.shields.io/npm/v/@captchafox/svelte.svg)](https://www.npmjs.com/package/@captchafox/svelte)

## Installation

Requires Svelte 5 or later.

Install the library using your prefered package manager

```sh
npm install @captchafox/svelte
```

```sh
yarn add @captchafox/svelte
```

```sh
pnpm add @captchafox/svelte
```

```sh
bun add @captchafox/svelte
```

## Usage

```svelte
<script lang="ts">
  import { CaptchaFox } from '@captchafox/svelte';
</script>

<CaptchaFox sitekey="sk_11111111000000001111111100000000" />
```

The widget only renders in the browser. During server-side rendering (e.g. SvelteKit) an empty container is rendered, and the widget is mounted once the page hydrates.

### Props

| **Prop**              | **Type**                                                                                              | **Description**                                                                                            | **Required** |
| --------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------ |
| sitekey               | `string`                                                                                              | The sitekey for the widget.                                                                                | ✅           |
| lang                  | `string`                                                                                              | The language the widget should display. Defaults to automatically detecting it.                            |              |
| mode                  | `inline\|popup\|hidden`                                                                               | The mode the widget should be displayed in.                                                                |              |
| start                 | `none\|auto\|focus`                                                                                   | Controls when the verification begins. Defaults to `none`.                                                 |              |
| theme                 | `light` &#124; `dark` &#124; [`ThemeDefinition`](https://docs.captchafox.com/en/theming#custom-theme) | The theme of the widget. Defaults to light.                                                                |              |
| nonce                 | `string`                                                                                              | Randomly generated nonce.                                                                                  |              |
| i18n                  | `object`                                                                                              | Custom i18n configuration.                                                                                 |              |
| hideClose             | `boolean`                                                                                             | Hides the close button and prevents users from closing the widget modal.                                   |              |
| class                 | `string`                                                                                              | CSS class name(s) for the widget container.                                                                |              |
| executeTimeoutSeconds | `number`                                                                                              | Seconds `execute()` waits for the widget to load before rejecting with a `TimeoutError`. Defaults to `30`. |              |
| token                 | `string`                                                                                              | Response token after successful verification, cleared on expiry. Use `bind:token`.                         |              |
| onVerify              | `function`                                                                                            | Called with the response token after successful verification.                                              |              |
| onFail                | `function`                                                                                            | Called after unsuccessful verification.                                                                    |              |
| onError               | `function`                                                                                            | Called when an error occurred.                                                                             |              |
| onExpire              | `function`                                                                                            | Called when the challenge expires.                                                                         |              |
| onClose               | `function`                                                                                            | Called when the challenge was closed.                                                                      |              |
| onLoad                | `function`                                                                                            | Called when the widget is ready.                                                                           |              |
| onChallengeOpen       | `function`                                                                                            | Called when the challenge was opened.                                                                      |              |
| onChallengeChange     | `function`                                                                                            | Called when the challenge changed.                                                                         |              |

Changing `sitekey`, `lang`, `mode`, `start`, `theme` or `hideClose` re-renders the widget. Callbacks can be changed at any time without a re-render.

### Using the verification callback

```svelte
<script lang="ts">
  import { CaptchaFox, CAPTCHA_RESPONSE_KEY } from '@captchafox/svelte';

  const handleVerify = (token: string) => {
    // do something with the token here (e.g. submit the form)
    const formData = {
      // your form data
      [CAPTCHA_RESPONSE_KEY]: token
    };
  };
</script>

<CaptchaFox sitekey="sk_11111111000000001111111100000000" onVerify={handleVerify} />
```

### Using bind:token

```svelte
<script lang="ts">
  import { CaptchaFox } from '@captchafox/svelte';

  // contains the response token after successful verification
  let token = $state<string>();
</script>

<CaptchaFox sitekey="sk_11111111000000001111111100000000" bind:token />
<pre>{token}</pre>
```

### Interacting with the instance

```svelte
<script lang="ts">
  import { CaptchaFox, RetryError, TimeoutError, type CaptchaFoxInstance } from '@captchafox/svelte';

  let captchafox = $state<CaptchaFoxInstance>();

  const triggerAction = async () => {
    // execute the captcha
    try {
      const token = await captchafox?.execute();
    } catch (error) {
      if (error instanceof TimeoutError) {
        // the widget did not load within `executeTimeoutSeconds`
      } else if (error instanceof RetryError) {
        // the script failed to load or the verification failed, try again
      } else {
        // 'challenge-aborted' or 'rate-limited'
      }
    }
  };
</script>

<CaptchaFox bind:this={captchafox} sitekey="sk_11111111000000001111111100000000" mode="hidden" />
<button onclick={triggerAction}>Action</button>
```

The instance exposes `execute()`, `getResponse()`, `reset()` and `remove()`. `execute()` can be called before the widget has finished loading: it waits up to `executeTimeoutSeconds` for the widget and then starts the verification.
