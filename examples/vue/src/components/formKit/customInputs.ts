import { createInput } from '@formkit/vue';
import FormKitCaptcha from './Captcha.vue';

export const captcha = createInput(FormKitCaptcha, {
  props: ['sitekey', 'mode', 'lang']
});
