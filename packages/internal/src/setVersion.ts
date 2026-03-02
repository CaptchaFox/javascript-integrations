export const setVersion = (name: string) => {
  (window as unknown as { _tsdk: { n: string; v: string } })._tsdk = {
    n: name,
    v: process.env.VERSION!
  };
};
