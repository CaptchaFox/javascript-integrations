export class RetryError extends Error {}
export class TimeoutError extends Error {}

export const backoff = (retryCount: number) => Math.exp(retryCount) * 150;

export type WithRetryOptions = { attempts?: number };

export const withRetry = async <T>(
  callback: () => Promise<T>,
  { attempts = 4 }: WithRetryOptions = {}
) => {
  let error;

  for (let i = 0; i < attempts; i++) {
    try {
      return await callback();
    } catch (err) {
      error = err as Error;
      await new Promise((r) => setTimeout(r, backoff(i)));
    }
  }

  throw new RetryError(error?.message ?? 'Exhausted all retries');
};
