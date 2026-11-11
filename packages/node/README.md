# @captchafox/node

[![NPM version](https://img.shields.io/npm/v/@captchafox/node.svg)](https://www.npmjs.com/package/@captchafox/node)

## Installation

Install the library using your prefered package manager

```sh
npm install @captchafox/node
```

```sh
yarn add @captchafox/node
```

```sh
pnpm add @captchafox/node
```

```sh
bun add @captchafox/node
```

## Usage

### ESM / await

```ts
import { verify } from '@captchafox/node';

const secret = 'organization_secret';
const token = 'widget_token';

try {
  const data = await verify(secret, token);
  if (data.success) {
    console.log('success!', data);
  } else {
    console.log('verification failed');
  }
} catch (error) {
  console.log(error);
}
```

### Require

```js
const { verify } = require('@captchafox/node');

const secret = 'organization_secret';
const token = 'widget_token';

verify(secret, token)
  .then((data) => {
    if (data.success) {
      console.log('success!', data);
    } else {
      console.log('verification failed');
    }
  })
  .catch(console.error);
```

### Options

`verify(secret, token, options?)` accepts an optional third argument:

| **Option**     | **Type** | **Description**                                                                              |
| -------------- | -------- | -------------------------------------------------------------------------------------------- |
| sitekey        | `string` | The sitekey that was used to issue the token.                                                |
| remoteIp       | `string` | The IP address of the user. Verification fails with `invalid-ip-match` if it does not match. |
| retry.attempts | `number` | How often the request is attempted on network or parse errors. Defaults to `4`.              |

```ts
const data = await verify(secret, token, {
  sitekey: 'sk_...',
  remoteIp: request.ip,
  retry: { attempts: 2 }
});
```

### Handling errors

A resolved response does not mean the verification passed. Always check `data.success`, and see `data['error-codes']` for the reason it failed (e.g. `timeout-or-duplicate` when a token was already used or has expired).

`verify` rejects if the CaptchaFox API could not be reached or returned something that is not valid JSON (a `ParseError` with the HTTP `code` and raw `body`), after all retry attempts were used. The [CaptchaFox documentation](https://docs.captchafox.com/en/getting-started) recommends not blocking your users in that case, but letting the request through and logging the event:

```ts
import { verify, ParseError } from '@captchafox/node';

try {
  const data = await verify(secret, token);
  if (!data.success) {
    // reject the request
  }
} catch (error) {
  // CaptchaFox could not be reached: let the request pass and log it
  console.error(
    'CaptchaFox verification unavailable',
    error instanceof ParseError ? error.code : error
  );
}
```

### Testing

Use the [test keys](https://docs.captchafox.com/en/automated-testing) in automated tests. They provide no protection and must not be used in production.

| **Key**    | **Value**                             | **Behaviour**                  |
| ---------- | ------------------------------------- | ------------------------------ |
| Site key   | `sk_11111111000000001111111100000000` | The challenge always succeeds. |
| Secret key | `ok_11111111000000001111111100000000` | Verification always succeeds.  |
| Site key   | `sk_FFFFFFFF00000000FFFFFFFF00000000` | The challenge always fails.    |
| Secret key | `ok_FFFFFFFF00000000FFFFFFFF00000000` | Verification always fails.     |
