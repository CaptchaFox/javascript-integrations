import { isApiReady, loadCaptchaScript } from '@captchafox/internal';
import type { WidgetApi, WidgetOptions } from '@captchafox/types';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

type CaptchaFoxProps = WidgetOptions & {
  /** Called after the widget has been loaded */
  onLoad?: () => void;
  className?: string;
};

export type CaptchaFoxInstance = Omit<WidgetApi, 'render'>;

export const CaptchaFox = forwardRef<CaptchaFoxInstance, CaptchaFoxProps>(
  (
    { sitekey, lang, mode, className, onError, onVerify, onLoad, onFail, onClose },
    ref
  ): JSX.Element => {
    const [containerRef, setContainerRef] = useState<HTMLDivElement | null>();
    const [widgetId, setWidgetId] = useState<string | undefined>();
    const firstRendered = useRef<boolean>(false);

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

            setWidgetId('');
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            window.captchafox!.remove(widgetId);
          },
          execute: () => {
            if (!isApiReady() || !widgetId) {
              return Promise.reject('[CaptchaFox] Widget has not been loaded');
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return window.captchafox!.execute(widgetId);
          }
        };
      },
      [widgetId]
    );

    const renderCaptcha = async (): Promise<void> => {
      window.captchafox?.remove(widgetId);

      if (!containerRef || containerRef?.children?.length === 1) return;

      const newWidgetId = await window.captchafox?.render(containerRef as HTMLElement, {
        lang,
        sitekey,
        mode,
        onError,
        onFail,
        onClose,
        onVerify
      });

      setWidgetId(newWidgetId);
      onLoad?.();
    };

    useEffect(() => {
      if (!containerRef) return;

      if (firstRendered.current) {
        if (isApiReady()) {
          renderCaptcha();
        }
      } else {
        loadCaptchaScript()
          .then(async () => {
            if (isApiReady()) {
              firstRendered.current = true;
              await renderCaptcha();
            }
          })
          .catch((err) => {
            onError?.(err);
            console.error('[CaptchaFox] Could not load script:', err);
          });
      }
    }, [containerRef, sitekey, lang, mode]);

    return <div ref={setContainerRef} id={widgetId} className={className} />;
  }
);

CaptchaFox.displayName = 'CaptchaFox';
