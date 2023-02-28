import { KnowledgeStructure } from '../entities/knowledge.model';
import { Repo } from './repo.interface';
import createDebug from 'debug';
import { KnowledgeModel } from './knowledges.mongo.model.js';
import { HTTPError } from '../errors/errors.js';

const debug = createDebug('W7CH2:repo');

export class KnowledgesMongoRepo implements Repo<KnowledgeStructure> {
  constructor() {
    debug('Repo instanced');
  }

  async query(): Promise<KnowledgeStructure[]> {
    debug('query method');

    const data = await KnowledgeModel.find();
    return data;
  }

  async queryId(id: string): Promise<KnowledgeStructure> {
    debug('queryID method');

    const data = await KnowledgeModel.findById(id);

    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in queryID');

    return data;
  }

  async create(
    knowledge: Partial<KnowledgeStructure>
  ): Promise<KnowledgeStructure> {
    debug('create method');

    const data = await KnowledgeModel.create(knowledge);

    return data;
  }

  async update(
    knowledge: Partial<KnowledgeStructure>
  ): Promise<KnowledgeStructure> {
    debug('update method');

    const data = await KnowledgeModel.findByIdAndUpdate(
      knowledge.id,
      knowledge,
      {
        new: true,
      }
    );

    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in update');

    return data;
  }

  async destroy(id: string): Promise<void> {
    debug('destroy method');

    const data = await KnowledgeModel.findByIdAndDelete(id);

    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: ID not found '
      );
  }
}
