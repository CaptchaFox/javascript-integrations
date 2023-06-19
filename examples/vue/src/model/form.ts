import type { CAPTCHA_RESPONSE_KEY } from '@captchafox/vue';

export type Data = {
  login: string;
  password: string;
  remember?: boolean;
  [CAPTCHA_RESPONSE_KEY]: string;
};
