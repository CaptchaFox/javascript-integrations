import { Component, createEffect, createSignal, on, onCleanup } from 'solid-js';

import { isApiReady, loadCaptchaScript } from '@captchafox/internal';
import type { WidgetApi, WidgetOptions } from '@captchafox/types';

export type CaptchaFoxInstance = Omit<WidgetApi, 'render'>;

type Ref<T> = T | ((el: T) => void) | undefined;

type CaptchaFoxProps = WidgetOptions & {
  /** Called after the widget has been loaded */
  onLoad?: () => void;
  className?: string;
  ref?: Ref<CaptchaFoxInstance>;
  nonce?: string;
};

export const CaptchaFox: Component<CaptchaFoxProps> = (props) => {
  const [widgetId, setWidgetId] = createSignal<string | undefined>();
  let containerRef: HTMLDivElement | undefined;

  if (typeof props.ref === 'function') {
    props.ref({
      getResponse() {
        if (!isApiReady() || !widgetId()) {
          // eslint-disable-next-line no-console
          console.warn('[CaptchaFox] Widget has not been loaded');
          return '';
        }

        return window.captchafox!.getResponse(widgetId());
      },
      reset() {
        if (!isApiReady() || !widgetId()) {
          // eslint-disable-next-line no-console
          console.warn('[CaptchaFox] Widget has not been loaded');
          return;
        }

        window.captchafox!.reset(widgetId());
      },
      remove() {
        if (!isApiReady() || !widgetId()) {
          // eslint-disable-next-line no-console
          console.warn('[CaptchaFox] Widget has not been loaded');
          return;
        }

        setWidgetId('');
        window.captchafox!.remove(widgetId());
      },
      execute: () => {
        if (!isApiReady() || !widgetId()) {
          return Promise.reject('[CaptchaFox] Widget has not been loaded');
        }

        return window.captchafox!.execute(widgetId());
      }
    });
  }

  const renderCaptcha = async (): Promise<void> => {
    if (!isApiReady()) {
      return;
    }

    window.captchafox?.remove(widgetId());

    if (!containerRef || containerRef.children.length === 1) {
      return;
    }

    const newWidgetId = await window.captchafox?.render(containerRef, {
      lang: props.lang,
      sitekey: props.sitekey,
      mode: props.mode,
      theme: props.theme,
      i18n: props.i18n,
      onError: props.onError,
      onFail: props.onFail,
      onClose: props.onClose,
      onVerify: props.onVerify,
      onChallengeChange: props.onChallengeChange,
      onChallengeOpen: props.onChallengeOpen
    });

    setWidgetId(newWidgetId);
    props.onLoad?.();
  };

  onCleanup(() => {
    if (!widgetId()) return;

    try {
      window.captchafox?.remove(widgetId());
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[CaptchaFox] Error during cleanup:', err);
    }
  });

  createEffect(
    on(
      () => [props.sitekey, props.lang, props.mode, props.theme],
      async () => {
        if (isApiReady()) {
          await renderCaptcha();
          return;
        }

        try {
          await loadCaptchaScript({ nonce: props.nonce });
          await renderCaptcha();
        } catch (err: any) {
          props.onError?.(err);
          // eslint-disable-next-line no-console
          console.error('[CaptchaFox] Could not load script:', err);
        }
      }
    )
  );

  return <div ref={containerRef} id={widgetId()}></div>;
};
