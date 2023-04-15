import * as internal from '@captchafox/internal';
import type { WidgetApi } from '@captchafox/types';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { CaptchaFox } from './CaptchaFox';

jest.mock('@captchafox/internal');

function setupCaptchaFoxWindow(options?: Partial<WidgetApi>) {
  window.captchafox = {
    render: options?.render ?? jest.fn().mockResolvedValue(1),
    getResponse: options?.getResponse ?? jest.fn(),
    remove: options?.remove ?? jest.fn(),
    reset: options?.reset ?? jest.fn(),
    execute: options?.execute ?? jest.fn()
  };
}

describe('@captchafox/react', () => {
  let scriptLoadSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.spyOn(internal, 'isApiReady').mockReturnValue(true);
    scriptLoadSpy = jest.spyOn(internal, 'loadCaptchaScript').mockResolvedValue();
  });

  afterEach(() => {
    delete window.captchafox;
    jest.restoreAllMocks();
  });

  describe('<CaptchaFox />', () => {
    it('should render and call onLoad', async () => {
      const renderSpy = jest.fn().mockResolvedValue(1);
      const loadSpy = jest.fn();
      setupCaptchaFoxWindow({ render: renderSpy });

      render(<CaptchaFox sitekey="test" onLoad={loadSpy} />);

      expect(scriptLoadSpy).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({ sitekey: 'test' })
        );
      });

      expect(loadSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onError if script fails to load', async () => {
      jest.spyOn(internal, 'loadCaptchaScript').mockRejectedValue('error');
      const renderSpy = jest.fn();
      const loadSpy = jest.fn();
      const errorSpy = jest.fn();
      setupCaptchaFoxWindow({ render: renderSpy });

      render(<CaptchaFox sitekey="test" onLoad={loadSpy} onError={errorSpy} />);

      await waitFor(() => {
        expect(renderSpy).not.toHaveBeenCalled();
      });

      expect(loadSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    it('should rerender widget on prop changes', async () => {
      const renderSpy = jest.fn().mockResolvedValue(1);
      setupCaptchaFoxWindow({ render: renderSpy });

      const { rerender } = render(<CaptchaFox sitekey="test" />);

      expect(scriptLoadSpy).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({ sitekey: 'test' })
        );
      });

      rerender(<CaptchaFox sitekey="another-key" />);

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({ sitekey: 'another-key' })
        );
      });

      rerender(<CaptchaFox sitekey="another-key" mode="inline" />);

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({ sitekey: 'another-key', mode: 'inline' })
        );
      });

      rerender(<CaptchaFox sitekey="another-key" lang="ja" />);

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({ sitekey: 'another-key', lang: 'ja' })
        );
      });
    });
  });

  describe('CaptchaInstance', () => {
    it('should call ref methods', async () => {
      const mockWidgetId = 2;
      const mockResponseToken = 'test-token';
      const refSpy = jest.fn();
      const resetSpy = jest.fn();
      const removeSpy = jest.fn();
      const responseSpy = jest.fn().mockReturnValue(mockResponseToken);
      const executeSpy = jest.fn().mockResolvedValue(mockResponseToken);
      const renderSpy = jest.fn().mockResolvedValue(mockWidgetId);

      setupCaptchaFoxWindow({
        reset: resetSpy,
        render: renderSpy,
        remove: removeSpy,
        execute: executeSpy,
        getResponse: responseSpy
      });

      render(<CaptchaFox sitekey="test" ref={refSpy} />);

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalled();
      });

      const refMethods = refSpy.mock.lastCall[0];

      refMethods.reset();
      expect(resetSpy).toHaveBeenCalled();

      const response = refMethods.getResponse();
      expect(responseSpy).toHaveBeenCalledWith(mockWidgetId);
      expect(response).toEqual(mockResponseToken);

      await waitFor(() => {
        refMethods.remove();
        expect(removeSpy).toHaveBeenCalled();
      });

      const executeToken = await refMethods.execute();
      expect(executeSpy).toHaveBeenCalledWith(mockWidgetId);
      expect(executeToken).toEqual(mockResponseToken);
    });

    it('should not call methods if api is not available', async () => {
      jest.spyOn(internal, 'isApiReady').mockReturnValue(false);
      const refSpy = jest.fn();
      const resetSpy = jest.fn();
      const removeSpy = jest.fn();
      const responseSpy = jest.fn();
      const executeSpy = jest.fn();
      const renderSpy = jest.fn();

      setupCaptchaFoxWindow({
        reset: resetSpy,
        render: renderSpy,
        remove: removeSpy,
        execute: executeSpy,
        getResponse: responseSpy
      });

      render(<CaptchaFox sitekey="test" ref={refSpy} />);

      await waitFor(() => {
        expect(renderSpy).not.toHaveBeenCalled();
      });

      const refMethods = refSpy.mock.lastCall[0];

      refMethods.reset();
      expect(resetSpy).not.toHaveBeenCalled();

      refMethods.getResponse();
      expect(responseSpy).not.toHaveBeenCalled();

      refMethods.remove();
      expect(removeSpy).not.toHaveBeenCalled();

      expect(refMethods.execute()).rejects.toBeDefined();
      expect(executeSpy).not.toHaveBeenCalled();
    });
  });
});
