import { UsersMongoRepo } from '../repository/users.mongo.repo';
import { UsersController } from './users.controller';
import { NextFunction, Request, Response } from 'express';

jest.mock('../helpers/auth.js');

describe('Given the UsersController', () => {
  const repo: UsersMongoRepo = {
    query: jest.fn(),
    queryId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    search: jest.fn(),
  };

  const req = {
    body: {
      email: 'test',
      password: 'test',
    },
  } as unknown as Request;

  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  const controller = new UsersController(repo);

  describe('When Register method is called', () => {
    test('Then if the user information is completed, it should return the json data', async () => {
      await controller.register(req, resp, next);
      expect(repo.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if user information is not found, it should throw an error', async () => {
      (repo.create as jest.Mock).mockRejectedValue(new Error());
      await controller.register(req, resp, next);
      expect(repo.create).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    // CASO DEL HTTP ERROR SIN PODER FINALIZAR:
    // test('Then if there is NO body.email or body.password, it should throw an error', async () => {
    //   const req = {
    //     body: {},
    //   } as unknown as Request;
    //   expect(async () =>
    //     controller.register(req, resp, next)
    //   ).rejects.toThrow();
    // });
  });

  describe('When Login method is called', () => {
    test('Then if the user information is completed, it should return the json data', async () => {
      req.body.email = 'test';
      req.body.password = 'test';
      await controller.login(req, resp, next);
      expect(repo.search).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });
});
