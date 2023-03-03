import { Request, Response, NextFunction } from 'express';
import { KnowledgeStructure } from '../entities/knowledge.model.js';
import { Repo } from '../repository/repo.interface.js';
import createDebug from 'debug';
import { UserStructure } from '../entities/user.model.js';
import { HTTPError } from '../errors/errors.js';
import { RequestPlus } from '../interceptors/logged';

const debug = createDebug('W7CH2:controller');

export class KnowledgesController {
  constructor(
    public repoKnowledges: Repo<KnowledgeStructure>,
    public repoUser: Repo<UserStructure>
  ) {
    this.repoKnowledges = repoKnowledges;
    this.repoUser = repoUser;
    debug('Controller instanced');
  }

  async getAll(_req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getAll method');

      const data = await this.repoKnowledges.query();

      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('get method');

      const idNumber = req.params.id;
      const data = await this.repoKnowledges.queryId(idNumber);

      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async post(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('post method');

      const userId = req.info?.id;

      if (!userId) throw new HTTPError(404, 'Not found', 'Not found user ID');

      const actualUser = await this.repoUser.queryId(userId);

      req.body.owner = userId;

      const newKnowledge = req.body;

      const data = await this.repoKnowledges.create(newKnowledge);

      actualUser.knowledges.push(data);

      this.repoUser.update(actualUser);

      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async patch(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('patch method');

      req.body.id = req.params.id ? req.params.id : req.body.id;

      const data = await this.repoKnowledges.update(req.body);

      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('delete method');

      const idNumber = req.params.id;
      await this.repoKnowledges.destroy(idNumber);

      resp.json({
        results: [],
      });
    } catch (error) {
      next(error);
    }
  }
}
