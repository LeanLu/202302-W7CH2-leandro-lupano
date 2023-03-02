import { Router as router } from 'express';
import { KnowledgesController } from '../controllers/knowledges.controller.js';
import { KnowledgesMongoRepo } from '../repository/knowledges.mongo.repo.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';
import { authorized } from '../interceptors/authorized.js';
import { logged } from '../interceptors/logged.js';

export const knowledgesRouter = router();

const repo = new KnowledgesMongoRepo();
const repoUser = new UsersMongoRepo();
const controller = new KnowledgesController(repo, repoUser);

knowledgesRouter.get('/', logged, controller.getAll.bind(controller));

knowledgesRouter.get('/:id', logged, controller.get.bind(controller));

knowledgesRouter.post('/', logged, controller.post.bind(controller));

knowledgesRouter.patch(
  '/:id',
  logged,
  authorized,
  controller.patch.bind(controller)
);

knowledgesRouter.delete(
  '/:id',
  logged,
  authorized,
  controller.delete.bind(controller)
);
