import type { JSX } from 'solid-js';

interface LayoutProps {
  children: JSX.Element;
}

export const BaseLayout = ({ children }: LayoutProps) => {
  return (
    <main class="container">
      <article class="box grid">{children}</article>
    </main>
  );
};
