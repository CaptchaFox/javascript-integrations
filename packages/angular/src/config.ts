import { InjectionToken } from '@angular/core';
import { WidgetDisplayMode } from '@captchafox/types';

export interface CaptchaConfig {
  /**
   * The default siteKey to use when no siteKey has been specified on a widget.
   */
  siteKey?: string;
  /**
   * The default mode the widget should use when no mode has been specified.
   * @see {@link https://docs.captchafox.com/widget-api#options}
   */
  mode?: WidgetDisplayMode;
  /**
   * The language the widget should display. Defaults to automatically detecting it.
   * @see {@link https://docs.captchafox.com/language-codes}
   */
  language?: string;
}

export const CAPTCHA_CONFIG = new InjectionToken<CaptchaConfig>('CAPTCHA_CONFIG');
