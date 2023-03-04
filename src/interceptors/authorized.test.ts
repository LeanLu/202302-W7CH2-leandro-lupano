import { NextFunction, Response } from 'express';
import { KnowledgesMongoRepo } from '../repository/knowledges.mongo.repo.js';
import { authorized } from './authorized.js';
import { RequestPlus } from './logged';

jest.mock('../config.js', () => ({
  _dirname: 'test',
  config: {
    secret: 'test',
  },
}));

describe('Given the Authorized function', () => {
  const resp = {} as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  const mockKnowledgeRepo = {
    queryId: jest.fn(),
  } as unknown as KnowledgesMongoRepo;

  (mockKnowledgeRepo.queryId as jest.Mock).mockResolvedValue({
    owner: { id: '1' },
  });

  const req = {
    info: { id: '2' },
    params: { id: '2' },
  } as unknown as RequestPlus;

  describe('When the function is called', () => {
    test('Then if req.info return undefined, it should be catch and call next function', async () => {
      const req = {
        info: undefined,
      } as unknown as RequestPlus;

      await authorized(req, resp, next, mockKnowledgeRepo);
      expect(next).toHaveBeenCalled();
    });

    test('Then if req.info.id is not equal to the return of repo.queryId, it should be catch and call next function', async () => {
      await authorized(req, resp, next, mockKnowledgeRepo);
      expect(next).toHaveBeenCalled();
    });

    test('Then if req.info.id is is equal to the return of repo.queryId, next function should be called', async () => {
      const req = {
        info: { id: '1' },
        params: { id: '1' },
      } as unknown as RequestPlus;

      await authorized(req, resp, next, mockKnowledgeRepo);
      expect(next).toHaveBeenCalled();
    });
  });
});
