# CaptchaFox Svelte example

Svelte 5 + Vite examples for [`@captchafox/svelte`](../../packages/svelte):

- **Basic**: plain HTML form, submit enabled after verification. It posts to a mock `/api/login` served by Vite (see `vite.config.ts`), which echoes the submitted fields including `cf-captcha-response`; your real endpoint must verify that token server-side, e.g. with [`@captchafox/node`](../../packages/node)
- **Hidden**: hidden mode with `execute()` on submit, including error handling
- **Bind token**: `bind:token` and `reset()` via `bind:this`

## Usage

From the repository root:

```sh
npm install
npm run build -- --filter=@captchafox/svelte...
npm run dev -w @examples/svelte
```

Then open [http://localhost:5173](http://localhost:5173).
