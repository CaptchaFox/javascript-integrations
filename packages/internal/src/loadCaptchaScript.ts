let resolveFn: () => void;
let rejectFn: (error: string | Event) => void;

const mountInstance = new Promise<void>((resolve, reject) => {
  resolveFn = resolve;
  rejectFn = reject;
});

const LOAD_FUNC_KEY = 'captchaFoxOnLoad';
const SCRIPT_SRC = `https://cdn.captchafox.com/api.js?render=explicit&onload=${LOAD_FUNC_KEY}`;

export async function loadCaptchaScript(): Promise<void> {
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return mountInstance;

  window[LOAD_FUNC_KEY] = resolveFn;

  const script = document.createElement('script');
  script.src = SCRIPT_SRC;
  script.async = true;
  script.defer = true;
  script.type = 'module';
  script.onerror = rejectFn;
  document.body.appendChild(script);

  return mountInstance;
}
