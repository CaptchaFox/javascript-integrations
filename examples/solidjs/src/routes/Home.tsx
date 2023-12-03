import { A } from '@solidjs/router';

export default function Home() {
  return (
    <>
      <main class="container examples">
        <div class="grid">
          <A href="/basic">
            <article>
              <hgroup>
                <h1>Basic</h1>
                <h2>Simple example using a form element</h2>
              </hgroup>
            </article>
          </A>
          <A href="/hidden">
            <article>
              <hgroup>
                <h1>Hidden</h1>
                <h2>Example using hidden mode</h2>
              </hgroup>
            </article>
          </A>
        </div>
      </main>
    </>
  );
}
