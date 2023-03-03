import { UserStructure } from '../entities/user.model';
import { UserModel } from './users.mongo.model';
import { UsersMongoRepo } from './users.mongo.repo';

jest.mock('./users.mongo.model.js');

jest.mock('../config.js', () => ({
  _dirname: 'test',
  config: {
    secret: 'test',
  },
}));

describe('Given UsersMongoRepo repository', () => {
  const repo = UsersMongoRepo.getInstance();

  describe('When the repository is instanced', () => {
    test('Then, the repo should be instance of UsersMongoRepo', () => {
      expect(repo).toBeInstanceOf(UsersMongoRepo);
    });
  });

  describe('When the query method is used', () => {
    test('Then it should return an empty array', async () => {
      (UserModel.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnValue([{ id: '1' }, { id: '2' }]),
      }));

      const result = await repo.query();
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
    });
  });

  describe('When the queryId method is used', () => {
    test('Then if the findById method resolve value to an object, it should return the object', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue({ id: '1' }),
      }));

      const result = await repo.queryId('1');
      expect(UserModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('Then if the findById method resolve value to null, it should throw an Error', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(null),
      }));
      expect(async () => repo.queryId('')).rejects.toThrow();
    });
  });

  describe('When the search method is used', () => {
    test('Then if it has an mock query object, it should return find resolved value', async () => {
      (UserModel.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue([{ id: '1' }]),
      }));

      const mockQuery = { key: 'test', value: 'test' };
      const result = await repo.search(mockQuery);
      expect(result).toEqual([{ id: '1' }]);
    });
  });

  describe('When the create method is used', () => {
    test('Then if it has an object to create, it should return the created object', async () => {
      (UserModel.create as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue({ email: 'test' }),
      }));

      const result = await repo.create({ email: 'test' });
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual({ email: 'test' });
    });
  });

  describe('When the update method is used', () => {
    const mockUser = {
      email: 'test',
    } as Partial<UserStructure>;

    test('Then if the findByIdAndUpdate method resolve value to an object, it should return the object', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue({
          email: 'test',
        }),
      }));

      const result = await repo.update(mockUser);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({ email: 'test' });
    });

    test('Then if the findByIdAndUpdate method resolve value to null, it should throw an Error', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(null),
      }));

      expect(async () => repo.update(mockUser)).rejects.toThrow();
    });
  });

  describe('When the delete method is used', () => {
    test('Then if it has an object to delete with its ID, the findByIdAndDelete function should be called', async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});
      await repo.destroy('1');
      expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then if the findByIdAndDelete method resolve value to undefined, it should throw an Error', async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.destroy('')).rejects.toThrow();
    });
  });
});
