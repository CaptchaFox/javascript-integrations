export * from './types';
export { loadCaptchaScript } from './loadCaptchaScript';

export const isApiReady = () => typeof window?.captchafox !== 'undefined';
export const isServer = () => typeof window === 'undefined';
export const CAPTCHA_RESPONSE_KEY = 'cf-captcha-response';
