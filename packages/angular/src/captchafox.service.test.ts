/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgZone } from '@angular/core';
import type { WidgetApi } from '@captchafox/types';
import { afterAll, afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { waitFor } from '@testing-library/angular';
import { mocked } from 'jest-mock';
import { CaptchaFoxService } from './captchafox.service';
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

describe('CaptchaFoxService', () => {
  beforeEach(() => {
    jest.spyOn(internal, 'isApiReady').mockReturnValue(true);
    jest.spyOn(internal, 'loadCaptchaScript').mockResolvedValue();
  });

  afterEach(() => {
    delete window.captchafox;
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should forward hideClose in hidden mode', async () => {
    const renderSpy = jest.fn<any>().mockResolvedValue(1);
    const zone = new NgZone({ enableLongStackTrace: false });
    const service = new CaptchaFoxService({}, 'browser' as unknown as object, zone);
    setupCaptchaFoxWindow({ render: renderSpy });

    const subscription = service.load({ siteKey: 'test', hideClose: true }).subscribe();

    await waitFor(() => {
      expect(renderSpy).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ sitekey: 'test', mode: 'hidden', hideClose: true })
      );
    });

    subscription.unsubscribe();
  });
});
