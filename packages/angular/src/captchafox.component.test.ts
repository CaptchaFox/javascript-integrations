/* eslint-disable @typescript-eslint/no-explicit-any */
import { WidgetApi } from '@captchafox/types';
import { afterAll, afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, waitFor } from '@testing-library/angular';
import { SpyInstance, mocked } from 'jest-mock';
import { CaptchaFoxComponent } from './captchafox.component';
import { CAPTCHA_CONFIG } from './config';
import * as internal from './loader';

jest.mock('./loader');

function setupCaptchaFoxWindow(options?: Partial<WidgetApi>) {
  window.captchafox = mocked({
    render: options?.render ?? jest.fn<any>().mockResolvedValue(1),
    getResponse: options?.getResponse ?? jest.fn(),
    remove: options?.remove ?? jest.fn(),
    reset: options?.reset ?? jest.fn(),
    execute: options?.execute ?? jest.fn()
  }) as unknown as WidgetApi;
}

describe('CaptchaFoxComponent', () => {
  const mockProviders = [
    {
      provide: CAPTCHA_CONFIG,
      useValue: {}
    }
  ];

  let scriptLoadSpy: SpyInstance;

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

  it('should render and call onLoad', async () => {
    const renderSpy = jest.fn<any>().mockResolvedValue(1);
    const loadSpy = jest.fn();
    setupCaptchaFoxWindow({ render: renderSpy });

    await render(CaptchaFoxComponent, {
      componentProperties: { siteKey: 'test' },
      componentOutputs: {
        load: {
          emit: loadSpy
        }
      } as any,
      providers: mockProviders
    });

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

    await render(CaptchaFoxComponent, {
      componentProperties: { siteKey: 'test' },
      componentOutputs: {
        load: {
          emit: loadSpy
        },
        error: {
          emit: errorSpy
        }
      } as any,
      providers: mockProviders
    });

    await waitFor(() => {
      expect(renderSpy).not.toHaveBeenCalled();
    });

    expect(loadSpy).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('should rerender widget on prop changes', async () => {
    const renderSpy = jest.fn<any>().mockResolvedValue(1);
    setupCaptchaFoxWindow({ render: renderSpy });

    const { rerender } = await render(CaptchaFoxComponent, {
      componentInputs: { siteKey: 'test' },
      providers: mockProviders
    });

    expect(scriptLoadSpy).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(renderSpy).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ sitekey: 'test' })
      );
    });

    await rerender({
      componentInputs: { siteKey: 'another-key' }
    });

    await waitFor(() => {
      expect(renderSpy).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ sitekey: 'another-key' })
      );
    });

    await rerender({
      componentInputs: { siteKey: 'another-key', mode: 'inline' }
    });

    await waitFor(() => {
      expect(renderSpy).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ sitekey: 'another-key', mode: 'inline' })
      );
    });

    await rerender({
      componentInputs: { siteKey: 'another-key', lang: 'ja' }
    });

    await waitFor(() => {
      expect(renderSpy).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ sitekey: 'another-key', lang: 'ja' })
      );
    });
  });

  it('should use global config', async () => {
    const renderSpy = jest.fn<any>().mockResolvedValue(1);
    setupCaptchaFoxWindow({ render: renderSpy });

    await render(CaptchaFoxComponent, {
      componentProperties: { siteKey: 'test' },
      providers: [
        {
          provide: CAPTCHA_CONFIG,
          useValue: {
            siteKey: 'another',
            mode: 'hidden',
            language: 'it'
          }
        }
      ]
    });

    await waitFor(() => {
      expect(renderSpy).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ sitekey: 'test', mode: 'hidden', lang: 'it' })
      );
    });
  });

  it('should use ControlValueAccessor methods', async () => {
    const changeSpy = jest.fn();
    const touchedSpy = jest.fn();

    const { fixture } = await render(CaptchaFoxComponent, {
      providers: mockProviders
    });

    expect(fixture.componentInstance.value).toEqual(null);

    fixture.componentInstance.registerOnChange(changeSpy);
    fixture.componentInstance.registerOnTouched(touchedSpy);
    fixture.componentInstance.writeValue('test');

    expect(fixture.componentInstance.value).toEqual('test');
    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(touchedSpy).toHaveBeenCalledTimes(1);
  });
});
