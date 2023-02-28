import { Router as router } from 'express';
import { KnowledgesController } from '../controllers/knowledges.controller.js';
import { KnowledgesMongoRepo } from '../repository/knowledges.mongo.repo.js';

export const knowledgesRouter = router();

const repo = new KnowledgesMongoRepo();

const controller = new KnowledgesController(repo);

knowledgesRouter.get('/', controller.getAll.bind(controller));

knowledgesRouter.get('/:id', controller.get.bind(controller));

knowledgesRouter.post('/', controller.post.bind(controller));

knowledgesRouter.patch('/:id', controller.patch.bind(controller));

knowledgesRouter.delete('/:id', controller.delete.bind(controller));
