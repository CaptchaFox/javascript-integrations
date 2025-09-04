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

type Language =
  | 'sv'
  | 'ko'
  | 'da'
  | 'cs'
  | 'id'
  | 'ru'
  | 'uk'
  | 'no'
  | 'pt'
  | 'tr'
  | 'fi'
  | 'en'
  | 'fr'
  | 'de'
  | 'it'
  | 'es'
  | 'nl'
  | 'tr'
  | 'fi'
  | 'ja'
  | 'pl'
  | 'ga'
  | 'zh-tw'
  | 'zh-cn';

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
  /** The theme of the widget. Defaults to light. */
  theme?: Theme;
  /** i18n configuration. Allows overriding i18n labels for specific languages. */
  i18n?: WidgetI18nConfig;
  /** Called when an error occurs. */
  onError?: (error?: Error | string) => void;
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
