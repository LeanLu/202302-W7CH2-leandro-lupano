import { UsersController } from './users.controller';
import { NextFunction, Request, Response } from 'express';
import { UserStructure } from '../entities/user.model';
import { Repo } from '../repository/repo.interface';
import { Auth } from '../helpers/auth.js';

jest.mock('../helpers/auth.js');

jest.mock('../config.js', () => ({
  _dirname: 'test',
  config: {
    secret: 'test',
  },
}));

describe('Given the UsersController', () => {
  const mockRepo = {
    create: jest.fn(),
    search: jest.fn(),
    query: jest.fn(),
  } as unknown as Repo<UserStructure>;

  const controller = new UsersController(mockRepo);

  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  describe('When getAll method is called', () => {
    test('Then if the user information is completed, resp.json should been called ', async () => {
      const req = {} as unknown as Request;

      await controller.getAll(req, resp, next);

      expect(mockRepo.query).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if the repo`s query() method throw an error, next function have been called', async () => {
      const req = {} as unknown as Request;

      (mockRepo.query as jest.Mock).mockRejectedValue('Error');
      await controller.getAll(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When Register method is called', () => {
    test('Then if the user information is completed, it should return the resp.satus and resp.json', async () => {
      const req = {
        body: {
          email: 'test',
          password: 'test',
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if user information in the body, has not email, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          password: 'test',
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if user information in the body, has not password, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          email: 'test',
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When Login method is called', () => {
    test('Then if the user information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        body: {
          email: 'test',
          password: 'test',
        },
      } as unknown as Request;

      (mockRepo.search as jest.Mock).mockResolvedValue(['test']);

      Auth.compare = jest.fn().mockResolvedValue(true);

      await controller.login(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if the user information has not email, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          password: 'test',
        },
      } as unknown as Request;

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the user information has not password, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          email: 'test',
        },
      } as unknown as Request;

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the user information is complete but the search method return an empty array, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          email: 'test',
          password: 'test',
        },
      } as unknown as Request;

      (mockRepo.search as jest.Mock).mockResolvedValue([]);

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the user information is complete but the compare method of Auth return false, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          email: 'test',
          password: 'test',
        },
      } as unknown as Request;

      (mockRepo.search as jest.Mock).mockResolvedValue(['test']);

      Auth.compare = jest.fn().mockResolvedValue(false);

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
