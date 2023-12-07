import { HelmetsMongoRepo } from './helmets.repo.mongo';
import { HelmetModel } from './helmets.model.mongo';
import { Helmet } from '../../entities/helmet';
import { HttpError } from '../../types/http.error';

jest.mock('./helmets.model.mongo.js');

describe('GivenUsersMongoRepo', () => {
  let repo: HelmetsMongoRepo;
  describe('When we instantiate it without errors', () => {
    const exec = jest.fn().mockResolvedValue('Test');
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

    test('Then it should execute getAll', async () => {
      const result = await repo.getAll();
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute getById', async () => {
      const result = await repo.getById('');
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute update', async () => {
      const result = await repo.update('1', { id: '2' });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute delete', async () => {
      await repo.delete('1');
      expect(exec).toHaveBeenCalled();
    });
  });

  describe('When we instantiate it with errors', () => {
    const excError = jest.fn().mockResolvedValue(null);
    beforeEach(() => {
      const mockQueryMethodError = jest.fn().mockReturnValue({
        excError,
      });

      HelmetModel.findByIdAndDelete = mockQueryMethodError;
      HelmetModel.findById = mockQueryMethodError;
      HelmetModel.findByIdAndUpdate = mockQueryMethodError;

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
