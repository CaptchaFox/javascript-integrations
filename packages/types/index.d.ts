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

export type WidgetOptions = {
  /** The sitekey for the widget. */
  sitekey: string;
  /** The language the widget should display. Defaults to automatically detecting it. */
  lang?: string;
  /** The mode the widget should be displayed in. */
  mode?: WidgetDisplayMode;
  /** Called when an error occurs. */
  onError?: (error?: Error | string) => void;
  /** Called with the response token after successful verification. */
  onVerify?: VerifyCallbackFunction;
  /** Called after the challenge expires. */
  onExpire?: VoidFunction;
  /** Called after unsuccessful verification. */
  onFail?: VoidFunction;
  /** Called when the challenge was closed. */
  onClose?: VoidFunction;
};
