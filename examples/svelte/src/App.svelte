<script lang="ts">
  import type { Component } from 'svelte';
  import BasicForm from './routes/BasicForm.svelte';
  import BindToken from './routes/BindToken.svelte';
  import Hidden from './routes/Hidden.svelte';
  import Home from './routes/Home.svelte';

  // Minimal hash router so the example doesn't need a routing library.
  const routes: Record<string, Component> = {
    '/': Home,
    '/basic': BasicForm,
    '/hidden': Hidden,
    '/bind-token': BindToken
  };

  const currentPath = () => window.location.hash.slice(1) || '/';

  let path = $state(currentPath());
  const Page = $derived(routes[path] ?? Home);
</script>

<svelte:window onhashchange={() => (path = currentPath())} />

<Page />
