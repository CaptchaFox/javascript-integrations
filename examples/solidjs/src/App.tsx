import { CaptchaFox, CaptchaFoxInstance } from '@captchafox/solid';
import './App.css';

function App() {
  let captchaRef: CaptchaFoxInstance;

  const handleVerify = (key: string) => {
    console.log('Token:', key);
  };

  return (
    <>
      <div class="card">
        <button
          onClick={async () => {
            console.log(await captchaRef.execute());
          }}
        >
          Execute
        </button>
      </div>
      <CaptchaFox
        ref={captchaRef!}
        sitekey="sk_11111111000000001111111100000000"
        onVerify={handleVerify}
      />
    </>
  );
}

export default App;
