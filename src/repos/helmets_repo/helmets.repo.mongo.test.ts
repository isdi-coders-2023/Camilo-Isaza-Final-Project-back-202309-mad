import { HelmetsMongoRepo } from './helmets.repo.mongo';
import { HelmetModel } from './helmets.model.mongo';

import { Helmet } from '../../entities/helmet';
import { HttpError } from '../../types/http.error';

jest.mock('./helmets.model.mongo.js');

describe('GivenUsersMongoRepo', () => {
  let repo: HelmetsMongoRepo;
  describe('When we instantiate it without errors', () => {
    const exec = jest.fn().mockResolvedValue('Test2');
    beforeEach(() => {
      const mockQueryMethod = jest.fn().mockReturnValue({
        exec,
      });
      HelmetModel.find = mockQueryMethod;
      HelmetModel.findById = mockQueryMethod;
      HelmetModel.create = jest
        .fn()
        .mockResolvedValue({} as Omit<Helmet, 'id'>);
      HelmetModel.findByIdAndUpdate = mockQueryMethod;
      HelmetModel.findByIdAndDelete = mockQueryMethod;

      repo = new HelmetsMongoRepo();
    });

    test('Then it should execute create', async () => {
      const result = await repo.create({} as Omit<Helmet, 'id'>);
      expect(HelmetModel.create).toHaveBeenCalled();
      expect(result).toStrictEqual({});
    });

    test('Then it should execute method getAll', async () => {
      const expected = await repo.getAll();
      expect(exec).toHaveBeenCalled();
      expect(expected).toBe('Test2');
    });

    test('Then it should execute method getById', async () => {
      const expected = await repo.getById('');
      expect(exec).toHaveBeenCalled();
      expect(expected).toBe('Test2');
    });

    test('Then it should execute method update', async () => {
      const expected = await repo.update('1', { id: '2' });
      expect(exec).toHaveBeenCalled();
      expect(expected).toBe('Test2');
    });

    test('Then it should execute method update', async () => {
      const expected = await repo.updateFavorite('1', true);
      expect(exec).toHaveBeenCalled();
      expect(expected).toBe('Test2');
    });

    test('Then it should execute method delete', async () => {
      await repo.delete('2');
      expect(exec).toHaveBeenCalled();
    });

    test('Then it should execute method getHelmetsByCategory', async () => {
      const expected = await repo.getHelmetsByCategory('1');
      expect(exec).toHaveBeenCalled();
      expect(expected).toBe('Test2');
    });

    test('Then it should execute method getHelmetsByFavorite', async () => {
      const expected = await repo.getHelmetsByFavorite();
      expect(exec).toHaveBeenCalled();
      expect(expected).toBe('Test2');
    });

    test('Then it should execute method getHelmetsByCategories', async () => {
      const expected = await repo.getHelmetsByCategories(['1']);
      expect(exec).toHaveBeenCalled();
      expect(expected).toBe('Test2');
    });

    test('Then it should execute method getInitialCategories', async () => {
      const mockFindResult = {
        sort: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(['SK2', 'SK3']),
      };

      HelmetModel.find = jest.fn().mockReturnValue(mockFindResult);

      const expected = await repo.getInitialCategories();
      expect(mockFindResult.sort).toHaveBeenCalledWith({ category: 1 });
      expect(mockFindResult.distinct).toHaveBeenCalledWith('category');
      expect(mockFindResult.exec).toHaveBeenCalled();
      expect(expected).toEqual(['SK2', 'SK3']);
    });
  });

  describe('When we instantiate it with errors', () => {
    const exec = jest.fn().mockResolvedValue(null);
    beforeEach(() => {
      const mockQueryMethod2 = jest.fn().mockReturnValue({
        exec,
      });

      HelmetModel.findByIdAndDelete = mockQueryMethod2;
      HelmetModel.findById = mockQueryMethod2;
      HelmetModel.findByIdAndUpdate = mockQueryMethod2;

      repo = new HelmetsMongoRepo();
    });
    test('Then it should not execute delete', async () => {
      await expect(repo.delete('1')).rejects.toThrow(HttpError);
    });
    test('Then it should not execute get by id', async () => {
      await expect(repo.getById('1')).rejects.toThrow(HttpError);
    });
    test('Then it should not execute update', async () => {
      await expect(repo.update('1', { id: '2' })).rejects.toThrow(HttpError);
    });
  });
});
