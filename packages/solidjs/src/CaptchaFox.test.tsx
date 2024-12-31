import { CaptchaFox } from '.';

import * as internal from '@captchafox/internal';
import { WidgetApi, WidgetDisplayMode } from '@captchafox/types';
import { afterAll, afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { SpyInstance, mocked } from 'jest-mock';
import { createSignal } from 'solid-js';

jest.mock('@captchafox/internal');

function setupCaptchaFoxWindow(options?: Partial<WidgetApi>) {
  window.captchafox = mocked({
    render: options?.render ?? jest.fn<any>().mockResolvedValue(1),
    getResponse: options?.getResponse ?? jest.fn(),
    remove: options?.remove ?? jest.fn(),
    reset: options?.reset ?? jest.fn(),
    execute: options?.execute ?? jest.fn()
  }) as unknown as WidgetApi;
}

describe('@captchafox/solid', () => {
  let scriptLoadSpy: SpyInstance<typeof internal.loadCaptchaScript>;

  beforeEach(() => {
    jest.spyOn(internal, 'isApiReady').mockReturnValue(true);
    scriptLoadSpy = jest.spyOn(internal, 'loadCaptchaScript').mockResolvedValue();
  });

  afterEach(() => {
    delete window.captchafox;
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('<CaptchaFox />', () => {
    it('should render and call onLoad', async () => {
      const renderSpy = jest.fn<any>().mockResolvedValue(1);
      const loadSpy = jest.fn();
      setupCaptchaFoxWindow({ render: renderSpy });

      render(() => <CaptchaFox sitekey="test" onLoad={loadSpy} />);

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({ sitekey: 'test' })
        );
        expect(loadSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('should load script if api does not exist', async () => {
      jest.spyOn(internal, 'isApiReady').mockReturnValue(false);

      render(() => <CaptchaFox sitekey="test" />);

      await waitFor(() => {
        expect(scriptLoadSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onError if script fails to load', async () => {
      jest.spyOn(internal, 'isApiReady').mockReturnValue(false);
      jest.spyOn(internal, 'loadCaptchaScript').mockRejectedValue('error');
      const renderSpy = jest.fn<any>();
      const loadSpy = jest.fn();
      const errorSpy = jest.fn();
      setupCaptchaFoxWindow({ render: renderSpy });

      render(() => <CaptchaFox sitekey="test" onLoad={loadSpy} onError={errorSpy} />);

      await waitFor(() => {
        expect(renderSpy).not.toHaveBeenCalled();
        expect(loadSpy).not.toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('should rerender widget on prop changes', async () => {
      const [sitekey, setSitekey] = createSignal('test');
      const [lang, setLang] = createSignal<string>();
      const [mode, setMode] = createSignal<WidgetDisplayMode>();
      const renderSpy = jest.fn<any>().mockResolvedValue(1);
      setupCaptchaFoxWindow({ render: renderSpy });

      render(() => <CaptchaFox sitekey={sitekey()} mode={mode()} lang={lang()} />);

      expect(scriptLoadSpy).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({ sitekey: 'test' })
        );
      });

      setSitekey('another-key');

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({ sitekey: 'another-key' })
        );
      });

      setMode('inline');

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({ sitekey: 'another-key', mode: 'inline' })
        );
      });

      setLang('ja');

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
      const refSpy = jest.fn<any>();
      const resetSpy = jest.fn();
      const removeSpy = jest.fn();
      const responseSpy = jest.fn<any>().mockReturnValue(mockResponseToken);
      const executeSpy = jest.fn<any>().mockResolvedValue(mockResponseToken);
      const renderSpy = jest.fn<any>().mockResolvedValue(mockWidgetId);

      setupCaptchaFoxWindow({
        reset: resetSpy,
        render: renderSpy,
        remove: removeSpy,
        execute: executeSpy,
        getResponse: responseSpy
      });

      render(() => <CaptchaFox sitekey="test" ref={refSpy} />);

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalled();
      });

      const refMethods: any = refSpy.mock.lastCall?.[0];

      refMethods.reset();
      expect(resetSpy).toHaveBeenCalled();

      const response = refMethods.getResponse();
      expect(responseSpy).toHaveBeenCalledWith(mockWidgetId);
      expect(response).toEqual(mockResponseToken);

      const executeToken = await refMethods.execute();
      expect(executeSpy).toHaveBeenCalledWith(mockWidgetId);
      expect(executeToken).toEqual(mockResponseToken);

      await waitFor(() => {
        refMethods.remove();
        expect(removeSpy).toHaveBeenCalled();
      });
    });

    it('should not call methods if api is not available', async () => {
      jest.spyOn(internal, 'isApiReady').mockReturnValue(false);
      const refSpy = jest.fn();
      const resetSpy = jest.fn();
      const removeSpy = jest.fn();
      const responseSpy = jest.fn<any>();
      const executeSpy = jest.fn<any>();
      const renderSpy = jest.fn<any>();

      setupCaptchaFoxWindow({
        reset: resetSpy,
        render: renderSpy,
        remove: removeSpy,
        execute: executeSpy,
        getResponse: responseSpy
      });

      render(() => <CaptchaFox sitekey="test" ref={refSpy} />);

      await waitFor(() => {
        expect(renderSpy).not.toHaveBeenCalled();
      });

      const refMethods: any = refSpy.mock.lastCall?.[0];

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
