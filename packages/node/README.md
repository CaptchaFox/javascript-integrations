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
} catch(error) {
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
