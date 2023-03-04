import { Router as router } from 'express';
import { KnowledgesController } from '../controllers/knowledges.controller.js';
import { KnowledgesMongoRepo } from '../repository/knowledges.mongo.repo.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';
import { authorized } from '../interceptors/authorized.js';
import { logged } from '../interceptors/logged.js';

export const knowledgesRouter = router();

const repoKnowledge = KnowledgesMongoRepo.getInstance();
const repoUser = UsersMongoRepo.getInstance();
const controller = new KnowledgesController(repoKnowledge, repoUser);

knowledgesRouter.get('/', controller.getAll.bind(controller));

knowledgesRouter.get('/:id', controller.get.bind(controller));

knowledgesRouter.post('/', logged, controller.post.bind(controller));

knowledgesRouter.patch(
  '/:id',
  logged,
  (req, resp, next) => authorized(req, resp, next, repoKnowledge),
  controller.patch.bind(controller)
);

knowledgesRouter.delete(
  '/:id',
  logged,
  (req, resp, next) => authorized(req, resp, next, repoKnowledge),
  controller.delete.bind(controller)
);
