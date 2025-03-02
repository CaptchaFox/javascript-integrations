export { loadCaptchaScript } from './loadCaptchaScript.js';
export { withRetry, RetryError, TimeoutError } from './withRetry.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isApiReady = () => typeof (window as any)?.captchafox !== 'undefined';
export const isServer = () => typeof window === 'undefined';
