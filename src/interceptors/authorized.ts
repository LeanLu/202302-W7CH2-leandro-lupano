import { NextFunction, Response } from 'express';
import { HTTPError } from '../errors/errors.js';
import { KnowledgesMongoRepo } from '../repository/knowledges.mongo.repo.js';
import { RequestPlus } from './logged.js';

export async function authorized(
  req: RequestPlus,
  _resp: Response,
  next: NextFunction,
  knowledgesRepo: KnowledgesMongoRepo
) {
  try {
    if (!req.info)
      throw new HTTPError(
        404,
        'Not found',
        'Token not found in authorized interceptor'
      );

    const userId = req.info.id;

    const knowledgeId = req.params.id;

    const knowledge = await knowledgesRepo.queryId(knowledgeId);

    if (knowledge.owner.id !== userId)
      throw new HTTPError(
        401,
        'Not authorized',
        'User ID is different from Owner ID'
      );

    next();
  } catch (error) {
    next(error);
  }
}
