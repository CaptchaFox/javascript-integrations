<script lang="ts">
  const examples = [
    { href: '#/basic', title: 'Basic', description: 'Simple example using a form element' },
    { href: '#/hidden', title: 'Hidden', description: 'Example using hidden mode' },
    { href: '#/bind-token', title: 'Bind token', description: 'Example using bind:token' }
  ];
</script>

<main class="container examples">
  <div class="grid">
    {#each examples as example (example.href)}
      <a href={example.href}>
        <article>
          <hgroup>
            <h1>{example.title}</h1>
            <h2>{example.description}</h2>
          </hgroup>
        </article>
      </a>
    {/each}
  </div>
</main>
