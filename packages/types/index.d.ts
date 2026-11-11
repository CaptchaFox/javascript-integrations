declare global {
  interface Window {
    captchafox?: WidgetApi;
  }
}

export type WidgetApi = {
  /** Render a new widget into the DOM. */
  render: RenderWidgetFunction;
  /** Get the response token from the widget. */
  getResponse: WidgetIdFunction<string>;
  /** Remove the widget from the DOM. */
  remove: WidgetIdFunction;
  /** Reset the widget. */
  reset: WidgetIdFunction;
  /** Execute the verification process. */
  execute: WidgetIdFunction<Promise<string>>;
};

export type WidgetIdFunction<T = void> = (widgetId?: string) => T;

export type VerifyCallbackFunction = (token: string) => void;

export type RenderWidgetFunction = (
  element: HTMLElement | string,
  options: WidgetOptions
) => string;

export type WidgetDisplayMode = 'inline' | 'popup' | 'hidden';

export type WidgetStart = 'none' | 'auto' | 'focus';

export type Theme = 'light' | 'dark' | ThemeDefinition;

export type ThemeDefinition = {
  general?: {
    primary?: string;
    success?: string;
    error?: string;
    borderRadius?: number;
  };
  button?: {
    background?: string;
    backgroundHover?: string;
    text?: string;
    checkbox?: string;
  };
  panel?: {
    background?: string;
    border?: string;
    text?: string;
  };
  slider?: {
    background?: string;
    knob?: string;
  };
};

/** Supported language codes. See https://docs.captchafox.com/en/language-codes */
type Language =
  | 'cs'
  | 'da'
  | 'de'
  | 'en'
  | 'es'
  | 'fi'
  | 'fr'
  | 'ga'
  | 'id'
  | 'it'
  | 'ja'
  | 'ko'
  | 'nl'
  | 'no'
  | 'pl'
  | 'pt'
  | 'ru'
  | 'sv'
  | 'tr'
  | 'uk'
  | 'zh-cn'
  | 'zh-hans'
  | 'zh-tw'
  | 'zh-hk'
  | 'zh-hant';

/** Error codes passed to the `onError` callback. See https://docs.captchafox.com/en/widget-api */
export type WidgetErrorCode =
  | 'internal-error'
  | 'load-challenge-error'
  | 'verify-challenge-error'
  | 'load-audio-error'
  | 'load-slide-error'
  | 'network-error'
  | 'challenge-aborted'
  | 'rate-limited'
  | 'invalid-sitekey'
  | 'site-not-allowed'
  | 'request-expired';

interface I18nLabels {
  initial?: string;
  progress?: string;
  success?: string;
  error?: string;
  retry?: string;
}

export type WidgetI18nConfig = Partial<Record<Language, I18nLabels>>;

export type WidgetOptions = {
  /** The sitekey for the widget. */
  sitekey: string;
  /** The language the widget should display. Defaults to automatically detecting it. */
  lang?: string;
  /** The mode the widget should be displayed in. */
  mode?: WidgetDisplayMode;
  /** Controls when the verification begins. Defaults to `none`. */
  start?: WidgetStart;
  /** The theme of the widget. Defaults to light. */
  theme?: Theme;
  /** i18n configuration. Allows overriding i18n labels for specific languages. */
  i18n?: WidgetI18nConfig;
  /** Hide the close button. This will prevent users from closing the widget modal */
  hideClose?: boolean;
  /** Called when an error occurs. */
  onError?: (error?: Error | WidgetErrorCode | (string & Record<never, never>)) => void;
  /** Called with the response token after successful verification. */
  onVerify?: VerifyCallbackFunction;
  /** Called after the challenge expires. */
  onExpire?: () => void;
  /** Called after unsuccessful verification. */
  onFail?: () => void;
  /** Called when the challenge was closed. */
  onClose?: () => void;
  /** Called when the challenge opened. */
  onChallengeOpen?: () => void;
  /** Called when the challenge changed. */
  onChallengeChange?: () => void;
};
