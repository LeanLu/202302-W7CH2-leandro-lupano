import { KnowledgeStructure } from '../entities/knowledge.model';
import { Repo } from './repo.interface';
import createDebug from 'debug';
import { KnowledgeModel } from './knowledges.mongo.model.js';
import { HTTPError } from '../errors/errors.js';

const debug = createDebug('W7CH2:knowledges-repo');

export class KnowledgesMongoRepo implements Repo<KnowledgeStructure> {
  private static instance: KnowledgesMongoRepo;

  public static getInstance(): KnowledgesMongoRepo {
    if (!KnowledgesMongoRepo.instance) {
      KnowledgesMongoRepo.instance = new KnowledgesMongoRepo();
    }

    return KnowledgesMongoRepo.instance;
  }

  private constructor() {
    debug('Knowledges-Repo instanced');
  }

  async query(): Promise<KnowledgeStructure[]> {
    debug('query method');

    const data = await KnowledgeModel.find().populate('owner', { things: 0 });

    return data;
  }

  async queryId(id: string): Promise<KnowledgeStructure> {
    debug('queryID method');

    const data = await KnowledgeModel.findById(id).populate('owner', {
      things: 0,
    });

    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in queryID');

    return data;
  }

  async create(
    knowledge: Partial<KnowledgeStructure>
  ): Promise<KnowledgeStructure> {
    debug('create method');

    const data = (await KnowledgeModel.create(knowledge)).populate('owner', {
      things: 0,
    });

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
    ).populate('owner', { things: 0 });

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

  async search(query: {
    key: string;
    value: unknown;
  }): Promise<KnowledgeStructure[]> {
    debug('search method');
    const data = await KnowledgeModel.find({
      [query.key]: query.value,
    }).populate('owner', { things: 0 });
    return data;
  }
}
