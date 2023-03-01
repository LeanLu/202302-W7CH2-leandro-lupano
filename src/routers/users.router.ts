import { Router as router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';

export const usersRouter = router();
const repo = new UsersMongoRepo();
const controller = new UsersController(repo);

usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
