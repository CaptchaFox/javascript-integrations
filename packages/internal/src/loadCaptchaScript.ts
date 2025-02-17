import { withRetry } from './withRetry.js';

let mountInstance: Promise<void> | undefined;

const LOAD_FUNC_KEY = 'captchaFoxOnLoad';
const SCRIPT_SRC = `https://cdn.captchafox.com/api.js?render=explicit&onload=${LOAD_FUNC_KEY}`;

type LoadCaptchaScriptOptions = {
  nonce?: string;
};

async function loadScript({ nonce }: LoadCaptchaScriptOptions = {}): Promise<void> {
  if (mountInstance && document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
    return mountInstance;
  }

  mountInstance = new Promise<void>((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)[LOAD_FUNC_KEY] = resolve;

    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onerror = (e) => {
      script.remove();
      mountInstance = undefined;
      reject(e);
    };
    if (nonce) {
      script.nonce = nonce;
    }
    document.body.appendChild(script);
  });

  return mountInstance;
}

export async function loadCaptchaScript(props: LoadCaptchaScriptOptions = {}): Promise<void> {
  return withRetry(() => loadScript(props));
}
