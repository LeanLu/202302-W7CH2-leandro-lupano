import { UserStructure } from '../entities/user.model';
import { HTTPError } from '../errors/errors.js';
import { Repo } from './repo.interface';
import { UserModel } from './users.mongo.model.js';
import createDebug from 'debug';

const debug = createDebug('W7CH2:users-repo');

export class UsersMongoRepo implements Repo<UserStructure> {
  constructor() {
    debug('Users-Repo instanced');
  }

  async query(): Promise<UserStructure[]> {
    debug('query method');
    return [];
  }

  async queryId(id: string): Promise<UserStructure> {
    debug('queryID method');
    const data = await UserModel.findById(id);
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in queryID');
    return data;
  }

  async search(query: { key: string; value: unknown }) {
    debug('search method');
    const data = await UserModel.find({ [query.key]: query.value });
    return data;
  }

  async create(info: Partial<UserStructure>): Promise<UserStructure> {
    debug('create method');
    const data = await UserModel.create(info);
    return data;
  }

  async update(info: Partial<UserStructure>): Promise<UserStructure> {
    debug('update method');
    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in update');
    return data;
  }

  async destroy(id: string): Promise<void> {
    debug('destroy method');
    const data = await UserModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: ID not found '
      );
  }
}
