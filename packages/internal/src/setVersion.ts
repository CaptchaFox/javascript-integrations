// `process.env.VERSION` is replaced with a string literal by each package's bundler. In unbundled
// builds (e.g. `@captchafox/svelte` in dev watch mode) `process` does not exist in the browser, so
// guard the access instead of crashing the widget.
const getVersion = (): string | undefined => {
  try {
    return process.env.VERSION;
  } catch {
    return undefined;
  }
};

export const setVersion = (name: string) => {
  (window as unknown as { _tsdk: { n: string; v?: string } })._tsdk = {
    n: name,
    v: getVersion()
  };
};
