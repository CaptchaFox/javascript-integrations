// Single entry point for everything used from the private `@captchafox/internal` package.
// `svelte-package` does not bundle dependencies, so the build step replaces the compiled
// `dist/internal.js` with a tsup bundle that inlines `@captchafox/internal` (see tsup.config.ts).
// Import from here (`./internal.js`) instead of `@captchafox/internal` directly.
export {
  isApiReady,
  loadCaptchaScript,
  RetryError,
  setVersion,
  TimeoutError
} from '@captchafox/internal';
