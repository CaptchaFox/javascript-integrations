import { InjectionToken } from '@angular/core';
import { Theme, WidgetDisplayMode, WidgetI18nConfig, WidgetStart } from '@captchafox/types';

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
   * The default start behavior to use when no start has been specified on a widget.
   * Controls when the verification begins. Defaults to `none`.
   * @see {@link https://docs.captchafox.com/widget-api#options}
   */
  start?: WidgetStart;
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
  /**
   * Hide the close button. This will prevent users from closing the widget modal.
   */
  hideClose?: boolean;
}

export const CAPTCHA_CONFIG = new InjectionToken<CaptchaConfig>('CAPTCHA_CONFIG');
