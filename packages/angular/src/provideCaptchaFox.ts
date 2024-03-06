import { CAPTCHA_CONFIG, CaptchaConfig } from './config';
import { makeEnvironmentProviders } from '@angular/core';
import { CaptchaFoxService } from './captchafox.service';

export const provideCaptchaFox = (config?: CaptchaConfig) => {
  return makeEnvironmentProviders([
    CaptchaFoxService,
    {
      provide: CAPTCHA_CONFIG,
      useValue: config || {}
    }
  ]);
};
