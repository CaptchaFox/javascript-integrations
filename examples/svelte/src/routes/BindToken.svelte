<script lang="ts">
  import { CaptchaFox, type CaptchaFoxInstance } from '@captchafox/svelte';
  import BaseLayout from '../components/BaseLayout.svelte';

  // Updated after verification and cleared when the token expires
  let token = $state<string>();
  let captcha = $state<CaptchaFoxInstance>();
</script>

<BaseLayout>
  <div>
    <hgroup>
      <h1>Bind token</h1>
      <h2>Keep the response token in sync with bind:token</h2>
    </hgroup>
    <CaptchaFox bind:this={captcha} bind:token sitekey="sk_11111111000000001111111100000000" />
    <button class="secondary" disabled={!token} onclick={() => captcha?.reset()}>Reset</button>
    <pre>{token ?? ''}</pre>
  </div>
</BaseLayout>
