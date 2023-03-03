import { NextFunction, Response } from 'express';
import { logged, RequestPlus } from './logged';

jest.mock('../helpers/auth.js');
jest.mock('../config.js', () => ({
  _dirname: 'test',
  config: {
    secret: 'test',
  },
}));

describe('Given the Logged function', () => {
  const req = {
    get: jest.fn(),
  } as unknown as RequestPlus;

  const resp = {} as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  describe('When the function is called', () => {
    test('Then if req.get return undefined, it should be catch and call next function', () => {
      (req.get as jest.Mock).mockReturnValue('');

      logged(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if req.get return string that does not start with Bearer, it should be catch and call next function', () => {
      (req.get as jest.Mock).mockReturnValue('Test');

      logged(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the header Authorization is Ok, it should call next function', () => {
      (req.get as jest.Mock).mockReturnValue('Bearer Test');

      logged(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
