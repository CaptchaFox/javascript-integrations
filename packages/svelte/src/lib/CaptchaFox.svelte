<script lang="ts" module>
  import type { WidgetApi, WidgetOptions } from '@captchafox/types';

  export type CaptchaFoxProps = Pick<
    WidgetOptions,
    | 'sitekey'
    | 'lang'
    | 'mode'
    | 'start'
    | 'theme'
    | 'i18n'
    | 'hideClose'
    | 'onVerify'
    | 'onError'
    | 'onExpire'
    | 'onFail'
    | 'onClose'
    | 'onChallengeOpen'
    | 'onChallengeChange'
  > & {
    /** Called after the widget has been loaded. */
    onLoad?: () => void;
    /** Response token after successful verification. Bindable via `bind:token`. */
    token?: string;
    /** Nonce for the script tag (CSP). */
    nonce?: string;
    /** CSS class name(s) for the widget container. */
    class?: string;
    /** Seconds `execute()` waits for the widget to load before rejecting with a `TimeoutError`. Defaults to `30`. */
    executeTimeoutSeconds?: number;
  };

  export type CaptchaFoxInstance = Omit<WidgetApi, 'render'>;
</script>

<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import {
    isApiReady,
    loadCaptchaScript,
    RetryError,
    setVersion,
    TimeoutError
  } from './internal.js';

  let {
    sitekey,
    lang,
    mode,
    start,
    theme,
    i18n,
    hideClose,
    nonce,
    class: className,
    executeTimeoutSeconds = 30,
    token = $bindable(),
    onLoad,
    onVerify,
    onError,
    onExpire,
    onFail,
    onClose,
    onChallengeOpen,
    onChallengeChange
  }: CaptchaFoxProps = $props();

  const NOT_LOADED = '[CaptchaFox] Widget has not been loaded';

  let container: HTMLDivElement;
  let widgetId: string | undefined;
  let scriptReady = $state(false);
  let destroyed = false;
  let scriptError = false;
  // Incremented on every render so a slow render that was superseded can clean up after itself.
  let renderRun = 0;

  type WidgetWaiter = { resolve: (id: string) => void; reject: (error: unknown) => void };
  // `execute()` calls made before the widget finished rendering.
  const widgetWaiters = new Set<WidgetWaiter>();

  const isWidgetReady = () => isApiReady() && !!widgetId;

  function waitForWidget(): Promise<string> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        waiter.reject(new TimeoutError('Execute timed out'));
      }, executeTimeoutSeconds * 1000);

      const settle = () => {
        clearTimeout(timeout);
        widgetWaiters.delete(waiter);
      };

      const waiter: WidgetWaiter = {
        resolve: (id) => {
          settle();
          resolve(id);
        },
        reject: (error) => {
          settle();
          reject(error);
        }
      };

      widgetWaiters.add(waiter);
    });
  }

  function rejectWidgetWaiters(error: unknown) {
    widgetWaiters.forEach((waiter) => waiter.reject(error));
  }

  // Same mapping as @captchafox/react: user-facing outcomes pass through, everything else is retryable.
  const toExecuteError = (error: unknown) =>
    error === 'challenge-aborted' || error === 'rate-limited' ? error : new RetryError();

  export function getResponse(): string {
    if (!isWidgetReady()) {
      console.warn(NOT_LOADED);
      return '';
    }

    return window.captchafox!.getResponse(widgetId);
  }

  export function reset(): void {
    if (!isWidgetReady()) {
      console.warn(NOT_LOADED);
      return;
    }

    window.captchafox!.reset(widgetId);
  }

  export function remove(): void {
    if (!isWidgetReady()) {
      console.warn(NOT_LOADED);
      return;
    }

    window.captchafox!.remove(widgetId);
    widgetId = undefined;
  }

  /**
   * Runs the verification and resolves with the response token. If the widget is still loading,
   * waits up to `executeTimeoutSeconds` for it. Rejects with a `RetryError` if the script failed to
   * load, a `TimeoutError` if loading took too long, or `'challenge-aborted'` / `'rate-limited'`.
   */
  export async function execute(): Promise<string> {
    if (scriptError) {
      throw new RetryError();
    }

    const id = isWidgetReady() ? widgetId! : await waitForWidget();

    try {
      return await window.captchafox!.execute(id);
    } catch (error) {
      throw toExecuteError(error);
    }
  }

  async function renderWidget(): Promise<void> {
    if (!isApiReady() || !container) return;

    const run = ++renderRun;

    if (widgetId) {
      window.captchafox!.remove(widgetId);
      widgetId = undefined;
    }

    // Callbacks read the props when they fire, so changing a callback does not need a re-render.
    const id = await window.captchafox!.render(container, {
      sitekey,
      lang,
      mode,
      start,
      theme,
      i18n,
      hideClose,
      onVerify: (response) => {
        token = response;
        onVerify?.(response);
      },
      onExpire: () => {
        token = '';
        onExpire?.();
      },
      onError: (error) => onError?.(error),
      onFail: () => onFail?.(),
      onClose: () => onClose?.(),
      onChallengeOpen: () => onChallengeOpen?.(),
      onChallengeChange: () => onChallengeChange?.()
    });

    if (destroyed || run !== renderRun) {
      window.captchafox?.remove(id);
      return;
    }

    widgetId = id;
    widgetWaiters.forEach((waiter) => waiter.resolve(id));
    onLoad?.();
  }

  onMount(() => {
    setVersion('sv');

    loadCaptchaScript({ nonce })
      .then(() => {
        if (!destroyed) scriptReady = true;
      })
      .catch((error) => {
        scriptError = true;
        rejectWidgetWaiters(new RetryError());
        onError?.(error);
        console.error('[CaptchaFox] Could not load script:', error);
      });

    return () => {
      destroyed = true;
      // Don't leave pending `execute()` calls hanging once the component is gone.
      rejectWidgetWaiters(new RetryError('Widget was destroyed'));
      if (!widgetId) return;

      try {
        window.captchafox?.remove(widgetId);
      } catch (error) {
        console.error('[CaptchaFox] Error during cleanup:', error);
      }
    };
  });

  $effect(() => {
    // Re-render the widget once the script is ready and whenever one of these options changes.
    void [sitekey, lang, mode, start, theme, hideClose];
    if (!scriptReady) return;

    untrack(() => {
      void renderWidget();
    });
  });
</script>

<div bind:this={container} class={className}></div>
