import { InjectionToken } from '@angular/core';
import { Theme, WidgetDisplayMode, WidgetI18nConfig } from '@captchafox/types';

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
  /**
   * The theme of the widget. Defaults to light.
   * @see {@link https://docs.captchafox.com/theming}
   */
  theme?: Theme;
  /**
   * i18n configuration. Allows overriding i18n labels for specific languages.
   */
  i18n?: WidgetI18nConfig;
}

export const CAPTCHA_CONFIG = new InjectionToken<CaptchaConfig>('CAPTCHA_CONFIG');
