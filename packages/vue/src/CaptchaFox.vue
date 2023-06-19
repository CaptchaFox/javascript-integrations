<script setup lang="ts">
import { isApiReady, loadCaptchaScript } from '@captchafox/internal';
import type { WidgetApi } from '@captchafox/types';
import { onMounted, ref, watch } from 'vue';
import type { WidgetOptions } from '@captchafox/types';

export type CaptchaFoxProps = Pick<WidgetOptions, 'sitekey' | 'lang' | 'mode'> & {
  modelValue?: string;
  containerClass?: string;
};

export type CaptchaFoxInstance = Omit<WidgetApi, 'render'>;

const widgetId = ref<string | undefined>();
const container = ref<HTMLDivElement | null>(null);

const props = defineProps<CaptchaFoxProps>();

const emit = defineEmits<{
  /** Called with the response token after successful verification. */
  verify: [token: string];
  /** Called after the challenge expires. */
  expire: [];
  /** Called when an error occurs. */
  error: [error?: Error | string];
  /** Called when the challenge was closed. */
  close: [];
  /** Called after unsuccessful verification. */
  fail: [];
  /** Called after the widget has been loaded */
  load: [];
  'update:modelValue': [token: string];
}>();

defineExpose({
  getResponse() {
    if (!isApiReady() || !widgetId.value) {
      console.warn('[CaptchaFox] Widget has not been loaded');
      return '';
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return window.captchafox!.getResponse(widgetId.value);
  },
  reset() {
    if (!isApiReady() || !widgetId.value) {
      console.warn('[CaptchaFox] Widget has not been loaded');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    window.captchafox!.reset(widgetId.value);
  },
  remove() {
    if (!isApiReady() || !widgetId.value) {
      console.warn('[CaptchaFox] Widget has not been loaded');
      return;
    }

    widgetId.value = '';
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    window.captchafox!.remove(widgetId.value);
  },
  execute: () => {
    if (!isApiReady() || !widgetId.value) {
      return Promise.reject('[CaptchaFox] Widget has not been loaded');
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return window.captchafox!.execute(widgetId.value);
  }
});

const renderCaptcha = async (): Promise<void> => {
  window.captchafox?.remove(widgetId.value);

  const newWidgetId = await window.captchafox?.render(container.value as HTMLElement, {
    lang: props.lang,
    sitekey: props.sitekey,
    mode: props.mode,
    onError: (error) => emit('error', error),
    onFail: () => emit('fail'),
    onClose: () => emit('close'),
    onVerify: (token: string) => {
      emit('verify', token);
      emit('update:modelValue', token);
    },
    onExpire: () => emit('expire')
  });

  widgetId.value = newWidgetId;
  emit('load');
};

onMounted(() => {
  loadCaptchaScript()
    .then(async () => {
      if (isApiReady()) {
        await renderCaptcha();
      }
    })
    .catch((error) => {
      emit('error', error)
      console.error('[CaptchaFox] Could not load script:', error);
    });
});

watch([() => props.lang, () => props.mode, () => props.sitekey], async () => {
  await renderCaptcha()
});
</script>

<template>
  <div
    ref="container"
    :class="containerClass"
  />
</template>
