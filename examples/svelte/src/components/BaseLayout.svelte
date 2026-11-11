<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<main class="container">
  <a href="#/">← All examples</a>
  <article class="box grid">{@render children()}</article>
</main>
