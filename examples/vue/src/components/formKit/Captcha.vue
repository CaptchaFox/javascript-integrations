<script setup lang="ts">
import { CaptchaFox } from '@captchafox/vue';
import type { CaptchaFoxProps } from '@captchafox/vue';
import { FormKitFrameworkContext } from '@formkit/core';
import { PropType } from 'vue';

defineProps({
  context: {
    type: Object as PropType<FormKitFrameworkContext & CaptchaFoxProps>,
    required: true
  }
});
</script>

<template>
  <CaptchaFox
    :sitekey="context.sitekey"
    :mode="context.mode"
    :lang="context.lang"
    :theme="context.theme"
    @verify="(token) => context.node.input(token)"
  />
</template>
