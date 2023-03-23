import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>CaptchaFox React</title>
      </Head>
      <main className="container examples">
        <div className="grid">
          <Link href="/basic">
            <article>
              <hgroup>
                <h1>Basic</h1>
                <h2>Simple example using a form element</h2>
              </hgroup>
            </article>
          </Link>
          <Link href="/hookform">
            <article>
              <hgroup>
                <h1>react-hook-form</h1>
                <h2>Example using react-hook-form</h2>
              </hgroup>
            </article>
          </Link>
          <Link href="/hidden">
            <article>
              <hgroup>
                <h1>Hidden</h1>
                <h2>Example using hidden mode</h2>
              </hgroup>
            </article>
          </Link>
        </div>
      </main>
    </>
  );
}
