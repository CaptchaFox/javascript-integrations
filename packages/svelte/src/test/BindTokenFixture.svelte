<script lang="ts">
  import { CaptchaFox, type CaptchaFoxInstance } from '../lib/index.js';

  let token = $state<string | undefined>();
  // Also keeps the documented `bind:this` pattern type-checked by svelte-check.
  let captcha = $state<CaptchaFoxInstance>();
</script>

<CaptchaFox sitekey="test" bind:token bind:this={captcha} />
<output data-testid="token">{token ?? ''}</output>
<button onclick={() => captcha?.reset()}>Reset</button>
