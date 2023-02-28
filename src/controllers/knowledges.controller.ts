import { Request, Response, NextFunction } from 'express';
import { KnowledgeStructure } from '../entities/knowledge.model.js';
import { Repo } from '../repository/repo.interface.js';

export class KnowledgesController {
  constructor(public repo: Repo<KnowledgeStructure>) {
    this.repo = repo;
  }

  async getAll(_req: Request, resp: Response, next: NextFunction) {
    try {
      const data = await this.repo.query();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }

    // EJEMPLO si fuese .then() para tener el caso:
    // this.repo
    //   .query()
    //   .then((data) =>
    //     data === undefined
    //       ? resp
    //           .status(500)
    //           .send(`<h1>Sorry, the knowledges can not be loaded<h1>`)
    //       : resp.status(200).json(data)
    //   );
  }

  async get(req: Request, resp: Response, next: NextFunction) {
    try {
      const idNumber = req.params.id;
      const data = await this.repo.queryId(idNumber);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async post(req: Request, resp: Response, next: NextFunction) {
    try {
      const newKnowledge = req.body;
      const data = await this.repo.create(newKnowledge);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async patch(req: Request, resp: Response, next: NextFunction) {
    try {
      req.body.id = req.params.id ? req.params.id : req.body.id;
      const data = await this.repo.update(req.body);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, resp: Response, next: NextFunction) {
    try {
      await this.repo.destroy(req.params.id);
      resp.json({
        results: [],
      });
    } catch (error) {
      next(error);
    }
  }
}
