import { CAPTCHA_RESPONSE_KEY, verify } from '@captchafox/node';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Data } from '../../model/form.model';

// store your secret in a env variable
const CAPTCHAFOX_SECRET = 'ok_11111111000000001111111100000000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body: Data = req.body;

  if (!body.login || !body.password) {
    return res.status(400).json({ error: 'No credentials provided' });
  }

  const responseToken = body[CAPTCHA_RESPONSE_KEY];
  // return bad request if token is missing
  if (!responseToken) {
    return res.status(400).json({ error: 'Captcha Token missing' });
  }

  // send request to verify response
  const verifyResponse = await verify(CAPTCHAFOX_SECRET, responseToken);

  // invalid token -> Send
  if (!verifyResponse.success) {
    const errorCodes = verifyResponse['error-codes'];

    return res.status(401).json({ error: 'Invalid captcha response', codes: errorCodes });
  }

  // run your backend logic after token has been verified

  // return response
  res.status(200).json({ user: body.login, lastLogin: Date.now() });
}
