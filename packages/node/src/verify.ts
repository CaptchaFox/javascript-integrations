import { request } from 'https';
import { stringify } from 'querystring';

const HOST = 'api.captchafox.com';
const API_PATH = '/siteverify';

/**
 * The response returned from the /siteverify
 * endpoint used for verifying the challenge token.
 */
export type VerifyResponse = {
  /** Whether verification succeeded or not */
  success: boolean;

  /**
   * ISO timestamp of the challenge (yyyy-MM-dd'T'HH:mm:ssZZ).
   * Only included on success.
   */
  challenge_ts?: string;

  /** Hostname of the site where the challenge was solved. Optional */
  hostname?: string;

  /** List of error codes. Only included if success is false */
  'error-codes'?: string[];
};

export type VerifyPayload = NodeJS.Dict<string> & {
  /** The organization secret */
  secret: string;
  /** The response token from the widget */
  response: string;
  /** (Optional) the sitekey that was use to issue the token */
  sitekey?: string;
};

export async function verify(
  secret: string,
  token: string,
  sitekey?: string
): Promise<VerifyResponse> {
  return new Promise(function verifyPromise(resolve, reject) {
    const payload: VerifyPayload = { secret, response: token };
    if (sitekey) {
      payload.sitekey = sitekey;
    }

    const data = stringify(payload);

    const options = {
      host: HOST,
      path: API_PATH,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'content-length': Buffer.byteLength(data)
      }
    };

    const apiRequest = request(options, (response) => {
      response.setEncoding('utf8');

      let responseBuffer = '';

      response
        .on('error', reject)
        .on('data', (chunk) => (responseBuffer += chunk))
        .on('end', () => {
          try {
            const json = JSON.parse(responseBuffer);
            resolve(json);
          } catch (error) {
            reject(error);
          }
        });
    });

    apiRequest.on('error', reject);
    apiRequest.write(data);
    apiRequest.end();
  });
}
