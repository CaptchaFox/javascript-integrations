export const backoff = (retryCount: number) => Math.exp(retryCount) * 100;

export type WithRetryOptions = { attempts?: number };

export const withRetry = async <T>(
  callback: () => Promise<T>,
  { attempts = 4 }: WithRetryOptions = {}
) => {
  let res;
  let error;

  for (let i = 0; i < attempts; i++) {
    try {
      res = await callback();
      break;
    } catch (err) {
      error = err as Error;
      await new Promise((r) => setTimeout(r, backoff(i)));
    }
  }

  if (!res) {
    throw error ?? new Error('Exhausted all retries');
  }

  return res;
};
