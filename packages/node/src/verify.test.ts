import { describe, expect, it } from '@jest/globals';
import nock from 'nock';
import { ParseError } from './errors/ParseError';
import { verify } from './verify';

describe('@captchafox/node', () => {
  const secret = 'ok_12345';
  const token = '1234';

  const mockRequest = nock('https://api.captchafox.com').post(
    '/siteverify',
    `secret=${secret}&response=${token}`
  );

  afterEach(() => {
    nock.cleanAll();
  });

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

  it('should retry request on server errors', async () => {
    const errorResponse = 'notjson';
    const successResponse = { success: true };

    mockRequest
      .twice()
      .reply(503, errorResponse)
      .post('/siteverify', `secret=${secret}&response=${token}`)
      .reply(200, JSON.stringify(successResponse));

    const response = await verify(secret, token);
    expect(response).toEqual(successResponse);
  });

  it('should throw parse error on invalid response', async () => {
    const mockResponeBody = 'notjson';
    mockRequest.times(4).reply(200, mockResponeBody);

    try {
      await verify(secret, token);
    } catch (error) {
      expect(error).toBeInstanceOf(ParseError);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((error as ParseError).body).toEqual(mockResponeBody);
    }
  });

  it('should throw error on request failure', () => {
    mockRequest.times(4).replyWithError('serverError');
    return expect(verify(secret, token)).rejects.toThrowError();
  });
});
