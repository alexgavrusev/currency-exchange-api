import * as request from 'supertest';

export const parseResponseAsString: (
  res: request.Response,
  callback: (err: Error | null, body: any) => void,
) => void = (res, callback) => {
  res.setEncoding('utf-8');
  res.body = '';
  res.on('data', (chunk) => {
    res.body += chunk;
  });
  res.on('end', () => {
    callback(null, res.body);
  });
};
