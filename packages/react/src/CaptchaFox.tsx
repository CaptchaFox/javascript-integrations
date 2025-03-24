import { isApiReady, loadCaptchaScript, RetryError, TimeoutError } from '@captchafox/internal';
import type { WidgetApi, WidgetOptions } from '@captchafox/types';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

type CaptchaFoxProps = WidgetOptions & {
  /** Called after the widget has been loaded */
  onLoad?: () => void;
  className?: string;
  nonce?: string;
  executeTimeoutSeconds?: number;
};

export type CaptchaFoxInstance = Omit<WidgetApi, 'render'>;

const SCRIPT_ERROR_EVENT = 'cf-script-error';

export const CaptchaFox = forwardRef<CaptchaFoxInstance, CaptchaFoxProps>(
  (
    {
      executeTimeoutSeconds = 30,
      sitekey,
      lang,
      mode,
      theme,
      className,
      nonce,
      i18n,
      onError,
      onVerify,
      onLoad,
      onFail,
      onClose
    },
    ref
  ): JSX.Element => {
    const [containerRef, setContainerRef] = useState<HTMLDivElement | null>();
    const [widgetId, setWidgetId] = useState<string | undefined>();
    const firstRendered = useRef<boolean>(false);
    const onReady = useRef<(id: string) => void | undefined>();
    const executeTimeout = useRef<ReturnType<typeof setTimeout> | undefined>();
    const scriptErrorListener = useRef<() => void | undefined>();
    const hasScriptError = useRef<boolean>(false);

    useImperativeHandle(
      ref,
      () => {
        return {
          getResponse() {
            if (!isApiReady() || !widgetId) {
              console.warn('[CaptchaFox] Widget has not been loaded');
              return '';
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return window.captchafox!.getResponse(widgetId);
          },
          reset() {
            if (!isApiReady() || !widgetId) {
              console.warn('[CaptchaFox] Widget has not been loaded');
              return;
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            window.captchafox!.reset(widgetId);
          },
          remove() {
            if (!isApiReady() || !widgetId) {
              console.warn('[CaptchaFox] Widget has not been loaded');
              return;
            }

            setWidgetId(undefined);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            window.captchafox!.remove(widgetId);
          },
          execute: async () => {
            if (hasScriptError.current) {
              return Promise.reject(new RetryError());
            }

            if (!isApiReady() || !widgetId) {
              return waitAndExecute();
            }

            try {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const token = await window.captchafox!.execute(widgetId);
              return token;
            } catch (error) {
              const errorType = getErrorType(error);
              return Promise.reject(errorType);
            }
          }
        };
      },
      [widgetId]
    );

    useEffect(() => {
      if (widgetId) {
        onLoad?.();
      }
    }, [widgetId]);

    useEffect(() => {
      return () => {
        clearEvents();
      };
    }, []);

    useEffect(() => {
      if (!containerRef) return;

      if (firstRendered.current) {
        if (isApiReady()) {
          renderCaptcha();
        }
      } else {
        loadCaptchaScript({ nonce })
          .then(async () => {
            if (isApiReady()) {
              firstRendered.current = true;
              await renderCaptcha();
            }
          })
          .catch((err) => {
            onError?.(err);

            hasScriptError.current = true;
            window.dispatchEvent(new CustomEvent(SCRIPT_ERROR_EVENT));

            console.error('[CaptchaFox] Could not load script:', err);
          });
      }
    }, [containerRef, sitekey, lang, mode]);

    const clearEvents = () => {
      clearTimeout(executeTimeout.current);
      if (scriptErrorListener.current) {
        window.removeEventListener(SCRIPT_ERROR_EVENT, scriptErrorListener.current);
      }
    };

    const waitAndExecute = () => {
      return new Promise<string>((resolve, reject) => {
        scriptErrorListener.current = () => {
          clearEvents();
          reject(new RetryError());
        };
        window.addEventListener(SCRIPT_ERROR_EVENT, scriptErrorListener.current);

        executeTimeout.current = setTimeout(() => {
          reject(new TimeoutError('Execute timed out'));
        }, executeTimeoutSeconds * 1000);

        onReady.current = (id: string) => {
          clearEvents();
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          window
            .captchafox!.execute(id)
            .then(resolve)
            .catch((error) => {
              const errorType = getErrorType(error);
              reject(errorType);
            });
        };
      });
    };

    const getErrorType = (error: unknown) => {
      if (error !== 'challenge-aborted' && error !== 'rate-limited') {
        return new RetryError();
      }

      return error;
    };

    const renderCaptcha = async (): Promise<void> => {
      window.captchafox?.remove(widgetId);

      if (!containerRef || containerRef?.children?.length === 1) return;

      const newWidgetId = await window.captchafox?.render(containerRef as HTMLElement, {
        lang,
        sitekey,
        mode,
        theme,
        i18n,
        onError,
        onFail,
        onClose,
        onVerify
      });

      if (!newWidgetId) {
        return;
      }

      setWidgetId(newWidgetId);

      if (onReady.current) {
        onReady.current(newWidgetId);
        onReady.current = undefined;
      }
    };

    return <div ref={setContainerRef} id={widgetId} className={className} />;
  }
);

CaptchaFox.displayName = 'CaptchaFox';
