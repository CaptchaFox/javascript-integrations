# @captchafox/svelte

## 1.0.1

### Patch Changes

- 52adc60: fix: normalize `repository.url` in package.json

## 1.0.0

### Major Changes

- 047358a: feat: add Svelte 5 integration

  New `@captchafox/svelte` package with a `CaptchaFox` component supporting all widget options, callback props, `bind:token` and an instance API (`execute`, `getResponse`, `reset`, `remove`) via `bind:this`. Like `@captchafox/react`, `execute()` waits for the widget to load (`executeTimeoutSeconds`, default 30) and rejects with `RetryError` / `TimeoutError`, which are exported.
