import { vi, SpyInstance } from 'vitest';
import * as internal from '@captchafox/internal';
import type { WidgetApi } from '@captchafox/types';
import { render, waitFor } from '@testing-library/vue';
import CaptchaFox from './CaptchaFox.vue';
import { mount } from '@vue/test-utils';

vi.mock('@captchafox/internal');

function setupCaptchaFoxWindow(options?: Partial<WidgetApi>) {
  window.captchafox = {
    render: options?.render ?? vi.fn().mockResolvedValue(1),
    getResponse: options?.getResponse ?? vi.fn(),
    remove: options?.remove ?? vi.fn(),
    reset: options?.reset ?? vi.fn(),
    execute: options?.execute ?? vi.fn()
  };
}

describe('@captchafox/vue', () => {
  let scriptLoadSpy: SpyInstance;

  beforeEach(() => {
    vi.spyOn(internal, 'isApiReady').mockReturnValue(true);
    scriptLoadSpy = vi.spyOn(internal, 'loadCaptchaScript').mockResolvedValue();
  });

  afterEach(() => {
    delete window.captchafox;
    vi.restoreAllMocks();
  });

  describe('<CaptchaFox />', () => {
    it('should render and call onLoad', async () => {
      const renderSpy = vi.fn().mockResolvedValue(1);
      setupCaptchaFoxWindow({ render: renderSpy });

      const { emitted } = render(CaptchaFox, { props: { sitekey: 'test' } });

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({ sitekey: 'test' })
        );
      });

      expect(emitted().load.length).toBe(1);
    });

    it('should call onError if script fails to load', async () => {
      vi.spyOn(internal, 'loadCaptchaScript').mockRejectedValue('error');
      const renderSpy = vi.fn();
      setupCaptchaFoxWindow({ render: renderSpy });

      const { emitted } = render(CaptchaFox, { props: { sitekey: 'test' } });

      await waitFor(() => {
        expect(renderSpy).not.toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(emitted().error.length).toBe(1);
      });
      expect(emitted().load).toBeUndefined();
    });

    it('should rerender widget on prop changes', async () => {
      const renderSpy = vi.fn().mockResolvedValue(1);
      setupCaptchaFoxWindow({ render: renderSpy });

      const wrapper = mount(CaptchaFox, { props: { sitekey: 'test' } });

      expect(scriptLoadSpy).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({ sitekey: 'test' })
        );
      });

      await wrapper.setProps({ sitekey: 'another-key' });

      expect(renderSpy).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ sitekey: 'another-key' })
      );

      await wrapper.setProps({ mode: 'inline' });

      expect(renderSpy).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ sitekey: 'another-key', mode: 'inline' })
      );

      await wrapper.setProps({ lang: 'es' });

      expect(renderSpy).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ sitekey: 'another-key', lang: 'es' })
      );
    });
  });

  describe('CaptchaInstance', () => {
    it('should expose methods', async () => {
      const wrapper = mount(CaptchaFox, {
        props: { sitekey: 'test' }
      });

      expect(wrapper.vm).toHaveProperty('reset');
      expect(wrapper.vm).toHaveProperty('remove');
      expect(wrapper.vm).toHaveProperty('execute');
    });
  });
});
