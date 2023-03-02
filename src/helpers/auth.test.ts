import { Auth, TokenPayload } from './auth';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

jwt.sign = jest.fn();

describe('Given the Auth class', () => {
  const payloadMock = {
    id: '1',
    email: 'test',
    role: 'test',
  } as TokenPayload;

  describe('When the Auth`s methods are called', () => {
    test('Then, if createJWT method is called, it should return the jwt.sign mock value ', () => {
      (jwt.sign as jest.Mock).mockResolvedValue('test');

      const result = Auth.createJWT(payloadMock);
      expect(result).toBeDefined();
    });
  });
});
