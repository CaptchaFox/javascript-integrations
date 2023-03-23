export { loadCaptchaScript } from './loadCaptchaScript';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isApiReady = () => typeof (window as any)?.captchafox !== 'undefined';
export const isServer = () => typeof window === 'undefined';
