import { verify } from './verify';
import nock from 'nock';

describe('@captchafox/node', () => {
  const secret = 'ok_12345';
  const token = '1234';

  const mockRequest = nock('https://api.captchafox.com').post(
    '/siteverify',
    `secret=${secret}&response=${token}`
  );

  it('should resolve on success', async () => {
    const successResponse = { success: true };

    mockRequest.reply(200, JSON.stringify(successResponse));

    const response = await verify(secret, token);
    expect(response).toEqual(successResponse);
  });

  it('should resolve on failure', async () => {
    const noSuccessResponse = { success: false, 'error-codes': ['invalid-token'] };

    mockRequest.reply(200, JSON.stringify(noSuccessResponse));

    const response = await verify(secret, token);
    expect(response).toEqual(noSuccessResponse);
  });

  it('should throw error on invalid response', async () => {
    mockRequest.reply(200, 'notjson');
    expect(verify(secret, token)).rejects.toThrowError();
  });

  it('should throw error on request failure', async () => {
    mockRequest.replyWithError('serverError');
    expect(verify(secret, token)).rejects.toThrowError();
  });
});
