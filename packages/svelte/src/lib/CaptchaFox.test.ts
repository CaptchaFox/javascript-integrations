import type { WidgetApi, WidgetOptions } from '@captchafox/types';
import { cleanup, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { flushSync } from 'svelte';
import BindTokenFixture from '../test/BindTokenFixture.svelte';
import CallbackSwapFixture from '../test/CallbackSwapFixture.svelte';
import CaptchaFox from './CaptchaFox.svelte';
import * as internal from './internal.js';

vi.mock('./internal.js', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./internal.js')>()),
  isApiReady: vi.fn(),
  loadCaptchaScript: vi.fn(),
  setVersion: vi.fn()
}));

function setupCaptchaFoxWindow(options?: Partial<WidgetApi>) {
  window.captchafox = {
    render: options?.render ?? vi.fn().mockResolvedValue('1'),
    getResponse: options?.getResponse ?? vi.fn(),
    remove: options?.remove ?? vi.fn(),
    reset: options?.reset ?? vi.fn(),
    execute: options?.execute ?? vi.fn()
  };
}

const lastRenderOptions = (renderSpy: Mock) => renderSpy.mock.lastCall?.[1] as WidgetOptions;

describe('@captchafox/svelte', () => {
  beforeEach(() => {
    vi.mocked(internal.isApiReady).mockReturnValue(true);
    vi.mocked(internal.loadCaptchaScript).mockResolvedValue();
  });

  afterEach(() => {
    cleanup();
    delete window.captchafox;
    vi.clearAllMocks();
  });

  describe('<CaptchaFox />', () => {
    it('should render and call onLoad', async () => {
      const renderSpy = vi.fn().mockResolvedValue('1');
      const onLoad = vi.fn();
      setupCaptchaFoxWindow({ render: renderSpy });

      render(CaptchaFox, { props: { sitekey: 'test', hideClose: true, onLoad } });

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({ sitekey: 'test', hideClose: true })
        );
      });

      await waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));
      expect(internal.setVersion).toHaveBeenCalledWith('sv');
    });

    it('should pass the nonce to the script loader', async () => {
      setupCaptchaFoxWindow();

      render(CaptchaFox, { props: { sitekey: 'test', nonce: 'abc' } });

      expect(internal.loadCaptchaScript).toHaveBeenCalledWith({ nonce: 'abc' });
    });

    it('should call onError if script fails to load', async () => {
      vi.mocked(internal.loadCaptchaScript).mockRejectedValue('error');
      vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const renderSpy = vi.fn();
      const onLoad = vi.fn();
      const onError = vi.fn();
      setupCaptchaFoxWindow({ render: renderSpy });

      render(CaptchaFox, { props: { sitekey: 'test', onLoad, onError } });

      await waitFor(() => expect(onError).toHaveBeenCalledWith('error'));
      expect(renderSpy).not.toHaveBeenCalled();
      expect(onLoad).not.toHaveBeenCalled();
    });

    it('should rerender widget on prop changes', async () => {
      const renderSpy = vi.fn().mockResolvedValue('1');
      setupCaptchaFoxWindow({ render: renderSpy });

      const { rerender } = render(CaptchaFox, { props: { sitekey: 'test' } });

      await waitFor(() => expect(renderSpy).toHaveBeenCalledTimes(1));

      const changes = [
        { sitekey: 'another-key' },
        { mode: 'inline' },
        { start: 'auto' },
        { hideClose: true },
        { lang: 'es' },
        { theme: 'dark' }
      ] as const;

      for (const change of changes) {
        await rerender(change);
        await waitFor(() => {
          expect(lastRenderOptions(renderSpy)).toEqual(expect.objectContaining(change));
        });
      }

      expect(renderSpy).toHaveBeenCalledTimes(changes.length + 1);
      expect(internal.loadCaptchaScript).toHaveBeenCalledTimes(1);
    });

    it('should not rerender when only a callback changes', async () => {
      const renderSpy = vi.fn().mockResolvedValue('1');
      setupCaptchaFoxWindow({ render: renderSpy });

      // Uses a parent component because testing-library's `rerender` invalidates all props at once.
      const first = vi.fn();
      const second = vi.fn();
      const { component } = render(CallbackSwapFixture, { props: { first, second } });

      await waitFor(() => expect(renderSpy).toHaveBeenCalledTimes(1));
      flushSync(() => component.swap());

      lastRenderOptions(renderSpy).onVerify?.('token');

      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledWith('token');
    });

    it('should forward widget events to callback props', async () => {
      const renderSpy = vi.fn().mockResolvedValue('1');
      setupCaptchaFoxWindow({ render: renderSpy });
      const callbacks = {
        onVerify: vi.fn(),
        onError: vi.fn(),
        onExpire: vi.fn(),
        onFail: vi.fn(),
        onClose: vi.fn(),
        onChallengeOpen: vi.fn(),
        onChallengeChange: vi.fn()
      };

      render(CaptchaFox, { props: { sitekey: 'test', ...callbacks } });
      await waitFor(() => expect(renderSpy).toHaveBeenCalled());

      const options = lastRenderOptions(renderSpy);
      options.onVerify?.('token');
      options.onError?.('network-error');
      options.onExpire?.();
      options.onFail?.();
      options.onClose?.();
      options.onChallengeOpen?.();
      options.onChallengeChange?.();

      expect(callbacks.onVerify).toHaveBeenCalledWith('token');
      expect(callbacks.onError).toHaveBeenCalledWith('network-error');
      for (const name of [
        'onExpire',
        'onFail',
        'onClose',
        'onChallengeOpen',
        'onChallengeChange'
      ] as const) {
        expect(callbacks[name]).toHaveBeenCalledTimes(1);
      }
    });

    it('should update a bound token on verify and clear it on expire', async () => {
      const renderSpy = vi.fn().mockResolvedValue('1');
      setupCaptchaFoxWindow({ render: renderSpy });

      render(BindTokenFixture);
      await waitFor(() => expect(renderSpy).toHaveBeenCalled());

      const options = lastRenderOptions(renderSpy);
      const output = screen.getByTestId('token');

      options.onVerify?.('token');
      await waitFor(() => expect(output.textContent).toBe('token'));

      options.onExpire?.();
      await waitFor(() => expect(output.textContent).toBe(''));
    });

    it('should remove a widget whose render was superseded', async () => {
      let resolveFirst: (id: string) => void = () => undefined;
      const renderSpy = vi
        .fn()
        .mockReturnValueOnce(new Promise((resolve) => (resolveFirst = resolve)))
        .mockResolvedValue('2');
      const removeSpy = vi.fn();
      setupCaptchaFoxWindow({ render: renderSpy, remove: removeSpy });

      const { rerender } = render(CaptchaFox, { props: { sitekey: 'test' } });
      await waitFor(() => expect(renderSpy).toHaveBeenCalledTimes(1));

      await rerender({ sitekey: 'another-key' });
      await waitFor(() => expect(renderSpy).toHaveBeenCalledTimes(2));

      resolveFirst('1');
      await waitFor(() => expect(removeSpy).toHaveBeenCalledWith('1'));
      expect(removeSpy).not.toHaveBeenCalledWith('2');
    });

    it('should remove the widget on unmount', async () => {
      const removeSpy = vi.fn();
      const onLoad = vi.fn();
      setupCaptchaFoxWindow({ remove: removeSpy });

      const { unmount } = render(CaptchaFox, { props: { sitekey: 'test', onLoad } });
      await waitFor(() => expect(onLoad).toHaveBeenCalled());

      unmount();

      expect(removeSpy).toHaveBeenCalledWith('1');
    });
  });

  describe('CaptchaFoxInstance', () => {
    it('should call widget api methods with the widget id', async () => {
      const onLoad = vi.fn();
      const api = {
        render: vi.fn().mockResolvedValue('2'),
        reset: vi.fn(),
        remove: vi.fn(),
        getResponse: vi.fn().mockReturnValue('test-token'),
        execute: vi.fn().mockResolvedValue('test-token')
      };
      setupCaptchaFoxWindow(api);

      const { component } = render(CaptchaFox, { props: { sitekey: 'test', onLoad } });
      await waitFor(() => expect(onLoad).toHaveBeenCalled());

      component.reset();
      expect(api.reset).toHaveBeenCalledWith('2');

      expect(component.getResponse()).toBe('test-token');
      expect(api.getResponse).toHaveBeenCalledWith('2');

      await expect(component.execute()).resolves.toBe('test-token');
      expect(api.execute).toHaveBeenCalledWith('2');

      component.remove();
      expect(api.remove).toHaveBeenCalledWith('2');
    });

    it('should not call widget api methods before the widget is loaded', () => {
      vi.mocked(internal.isApiReady).mockReturnValue(false);
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const api = { reset: vi.fn(), remove: vi.fn(), getResponse: vi.fn() };
      setupCaptchaFoxWindow(api);

      const { component } = render(CaptchaFox, { props: { sitekey: 'test' } });

      component.reset();
      component.remove();
      expect(component.getResponse()).toBe('');

      Object.values(api).forEach((spy) => expect(spy).not.toHaveBeenCalled());
    });

    it('should wait for the widget before executing', async () => {
      let resolveRender: (id: string) => void = () => undefined;
      const renderSpy = vi.fn().mockReturnValue(new Promise((r) => (resolveRender = r)));
      const executeSpy = vi.fn().mockResolvedValue('test-token');
      setupCaptchaFoxWindow({ render: renderSpy, execute: executeSpy });

      const { component } = render(CaptchaFox, { props: { sitekey: 'test' } });
      const first = component.execute();
      const second = component.execute();

      await waitFor(() => expect(renderSpy).toHaveBeenCalled());
      expect(executeSpy).not.toHaveBeenCalled();

      resolveRender('3');

      await expect(first).resolves.toBe('test-token');
      await expect(second).resolves.toBe('test-token');
      expect(executeSpy).toHaveBeenCalledTimes(2);
      expect(executeSpy).toHaveBeenCalledWith('3');
    });

    it('should reject with a TimeoutError if the widget does not load in time', async () => {
      vi.useFakeTimers();
      try {
        vi.mocked(internal.loadCaptchaScript).mockReturnValue(new Promise(() => undefined));
        const executeSpy = vi.fn();
        setupCaptchaFoxWindow({ execute: executeSpy });

        const { component } = render(CaptchaFox, {
          props: { sitekey: 'test', executeTimeoutSeconds: 5 }
        });
        const result = component.execute();
        const assertion = expect(result).rejects.toBeInstanceOf(internal.TimeoutError);

        await vi.advanceTimersByTimeAsync(4_999);
        expect(executeSpy).not.toHaveBeenCalled();
        await vi.advanceTimersByTimeAsync(1);

        await assertion;
        expect(executeSpy).not.toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    });

    it('should reject pending and later executes with a RetryError if the script fails', async () => {
      let rejectScript: (error: unknown) => void = () => undefined;
      vi.mocked(internal.loadCaptchaScript).mockReturnValue(
        new Promise((_, reject) => (rejectScript = reject))
      );
      vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const executeSpy = vi.fn();
      setupCaptchaFoxWindow({ execute: executeSpy });

      const { component } = render(CaptchaFox, { props: { sitekey: 'test' } });
      const pending = component.execute();

      rejectScript('network');

      await expect(pending).rejects.toBeInstanceOf(internal.RetryError);
      await expect(component.execute()).rejects.toBeInstanceOf(internal.RetryError);
      expect(executeSpy).not.toHaveBeenCalled();
    });

    it('should reject pending executes when unmounted', async () => {
      vi.mocked(internal.loadCaptchaScript).mockReturnValue(new Promise(() => undefined));
      setupCaptchaFoxWindow();

      const { component, unmount } = render(CaptchaFox, { props: { sitekey: 'test' } });
      const pending = component.execute();

      unmount();

      await expect(pending).rejects.toBeInstanceOf(internal.RetryError);
    });

    it.each([
      ['challenge-aborted', 'challenge-aborted'],
      ['rate-limited', 'rate-limited'],
      ['network-error', expect.any(internal.RetryError)]
    ])('should map execute error %s', async (error, expected) => {
      const onLoad = vi.fn();
      setupCaptchaFoxWindow({ execute: vi.fn().mockRejectedValue(error) });

      const { component } = render(CaptchaFox, { props: { sitekey: 'test', onLoad } });
      await waitFor(() => expect(onLoad).toHaveBeenCalled());

      await expect(component.execute()).rejects.toEqual(expected);
    });
  });
});
