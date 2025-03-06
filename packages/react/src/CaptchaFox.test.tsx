/* eslint-disable @typescript-eslint/no-explicit-any */
import * as internal from '@captchafox/internal';
import type { WidgetApi } from '@captchafox/types';
import { afterAll, afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { SpyInstance, mocked } from 'jest-mock';
import React from 'react';
import { CaptchaFox } from './CaptchaFox';

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

describe('@captchafox/react', () => {
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
      const renderSpy = jest.fn<any>();
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
      const renderSpy = jest.fn<any>().mockResolvedValue(1);
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

      render(<CaptchaFox sitekey="test" ref={refSpy} />);

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalled();
      });

      const refMethods: any = refSpy.mock.lastCall?.[0];

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

      render(<CaptchaFox sitekey="test" ref={refSpy} />);

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

    it('should wait for load if execute not ready', async () => {
      const mockWidgetId = 2;
      const mockResponseToken = 'test-token';
      const refSpy = jest.fn();
      const executeSpy = jest.fn<any>().mockResolvedValue(mockResponseToken);
      const renderSpy = jest.fn<any>().mockResolvedValue(mockWidgetId);

      setupCaptchaFoxWindow({
        render: renderSpy,
        execute: executeSpy
      });

      render(<CaptchaFox sitekey="test" ref={refSpy} />);

      const refMethods: any = refSpy.mock.lastCall?.[0];
      refMethods.execute();

      await waitFor(() => {
        expect(executeSpy).toHaveBeenCalledWith(mockWidgetId);
      });
    });
  });
});
