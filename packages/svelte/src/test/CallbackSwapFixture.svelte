<script lang="ts">
  import CaptchaFox from '../lib/CaptchaFox.svelte';

  let { first, second }: { first: (token: string) => void; second: (token: string) => void } =
    $props();

  let useSecond = $state(false);

  export function swap() {
    useSecond = true;
  }
</script>

<CaptchaFox sitekey="test" onVerify={useSecond ? second : first} />
