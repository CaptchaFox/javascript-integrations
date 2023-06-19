<template>
  <main className="container examples">
    <div className="grid">
      <router-link to="/basic">
        <article>
          <hgroup>
            <h1>Basic</h1>
            <h2>Simple example using a form element</h2>
          </hgroup>
        </article>
      </router-link>
      <router-link to="/formkit">
        <article>
          <hgroup>
            <h1>FormKit</h1>
            <h2>Example using FormKit</h2>
          </hgroup>
        </article>
      </router-link>
      <router-link to="/hidden">
        <article>
          <hgroup>
            <h1>Hidden</h1>
            <h2>Example using hidden mode</h2>
          </hgroup>
        </article>
      </router-link>
    </div>
  </main>
</template>