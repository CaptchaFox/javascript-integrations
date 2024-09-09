# @captchafox/react

[![NPM version](https://img.shields.io/npm/v/@captchafox/react.svg)](https://www.npmjs.com/package/@captchafox/react)

## Installation

Install the library using your prefered package manager

```sh
npm install @captchafox/react
```

```sh
yarn add @captchafox/react
```

```sh
pnpm add @captchafox/react
```

```sh
bun add @captchafox/react
```

## Usage

```tsx
import { CaptchaFox } from '@captchafox/react';

function Example() {
  return <CaptchaFox sitekey="sk_11111111000000001111111100000000" />;
}
```

### Props

| **Prop** | **Type**                                                                                           | **Description**                                                                 | **Required** |
| -------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------ |
| sitekey  | `string`                                                                                           | The sitekey for the widget                                                      | ✅            |
| lang     | `string`                                                                                           | The language the widget should display. Defaults to automatically detecting it. |              |
| mode     | `inline\|popup\|hidden`                                                                            | The mode the widget should be displayed in .                                    |              |
| theme    | `light` &#124; `dark` &#124; [`ThemeDefinition`](https://docs.captchafox.com/theming#custom-theme) | The theme of the widget. Defaults to light.                                     |              |
| nonce    | `string`                                                                                           | Randomly generated nonce .                                                      |              |
| i18n     | `object`                                                                                           | Custom i18n configuration.                                                      |              |
| onVerify | `function`                                                                                         | Called with the response token after successful verification.                   |              |
| onFail   | `function`                                                                                         | Called after unsuccessful verification.                                         |              |
| onError  | `function`                                                                                         | Called when an error occured.                                                   |              |
| onExpire | `function`                                                                                         | Called when the challenge expires.                                              |              |
| onClose  | `function`                                                                                         | Called when the challenge was closed.                                           |              |

### Using the verification callback

```jsx
import { CaptchaFox, CAPTCHA_RESPONSE_KEY } from '@captchafox/react';

function Example() {
  const handleVerify = (token: string) => {
    // do something with the token here (e.g. submit the form)
    const formData = {
      // your form data
      [CAPTCHA_RESPONSE_KEY]: token
    };
  };

  return <CaptchaFox sitekey="sk_11111111000000001111111100000000" onVerify={handleVerify} />;
}
```

### Interacting with the instance

```jsx
import { useRef } from 'react'
import { CaptchaFox, CaptchaFoxInstance } from '@captchafox/react'

function Example() {
    const captchaRef = useRef<CaptchaFoxInstance | null>(null);

    const triggerAction = async () => {
        // execute the captcha
        try {
            const token = await captchaRef.current?.execute()
        } catch {
            // unsuccessful verification
        }
    }

    return (
        <CaptchaFox
            sitekey="sk_11111111000000001111111100000000"
            ref={captchaRef}
        />
        <button onClick={triggerAction}>Action</button>
    )
}
```

You can find more detailed examples in the [GitHub repository](https://github.com/CaptchaFox/javascript-integrations/tree/main/examples/react).
