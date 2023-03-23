import { isApiReady, loadCaptchaScript } from '@captchafox/internal';
import type { WidgetApi, WidgetOptions } from '@captchafox/types';
import { createRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

type CaptchaFoxProps = WidgetOptions & {
  /** Called after the widget has been loaded */
  onLoad?: () => void;
  className?: string;
};

export type CaptchaFoxInstance = Omit<WidgetApi, 'render'>;

export const CaptchaFox = forwardRef<CaptchaFoxInstance, CaptchaFoxProps>(
  (
    { sitekey, lng, mode, className, onError, onVerify, onLoad, onFail, onClose },
    ref
  ): JSX.Element => {
    const containerRef = createRef<HTMLDivElement>();
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

      if (!containerRef.current || containerRef.current?.children?.length === 1) return;

      const newWidgetId = await window.captchafox?.render(containerRef.current as HTMLElement, {
        lng,
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
    }, [sitekey, lng, mode]);

    return <div ref={containerRef} id={widgetId} className={className} />;
  }
);

CaptchaFox.displayName = 'CaptchaFox';
