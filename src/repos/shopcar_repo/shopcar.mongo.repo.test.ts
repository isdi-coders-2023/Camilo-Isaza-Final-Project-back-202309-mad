import { ShopCarMongoRepo } from './shopcar.mongo.repo';
import { ShopCarModel } from './shopcar.mongo.model';
import { ShopCar } from '../../entities/shop_car';
import { User } from '../../entities/user';
import { UsersMongoRepo } from '../users_repo/users.mongo.repo';
import { HttpError } from '../../types/http.error';

jest.mock('./shopcar.mongo.model.js');

describe('GivenUsersMongoRepo', () => {
  let repo: ShopCarMongoRepo;
  beforeEach(() => {
    repo = new ShopCarMongoRepo();
  });
  describe('When we instantiate it without errors', () => {
    test('Then it should execute method getAll', async () => {
      const exec = jest.fn().mockResolvedValue([{}]);
      ShopCarModel.find = jest.fn().mockReturnValue({
        exec,
      });
      const result = await repo.getAll();
      expect(result).toEqual([{}]);
    });

    test('Then it should execute method getById', async () => {
      const mockShopCar = {} as ShopCar;
      const exec = jest.fn().mockResolvedValue(mockShopCar);
      ShopCarModel.findById = jest.fn().mockReturnValue({
        exec,
      });
      const result = await repo.getById('1');
      expect(result).toEqual(mockShopCar);
    });

    test('Then it should execute method getByUserId', async () => {
      const exec = jest.fn().mockResolvedValue([{}]);
      ShopCarModel.find = jest.fn().mockReturnValue({
        exec,
      });
      const result = await repo.getByUserId('1');
      expect(result).toEqual([{}]);
    });

    test('Then it should execute method update', async () => {
      const mockShopCar = {} as ShopCar;
      const exec = jest.fn().mockResolvedValue(mockShopCar);

      ShopCarModel.findById = jest.fn().mockReturnValue({
        exec,
      });
      ShopCarModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec,
      });
      const result = await repo.update('1', mockShopCar);
      expect(result).toEqual(mockShopCar);
    });

    test('Then it should execute method update with error', async () => {
      const mockShopCar = {} as ShopCar;
      const exec = jest.fn().mockResolvedValue(null);

      ShopCarModel.findById = jest.fn().mockReturnValue({
        exec,
      });
      ShopCarModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec,
      });
      await expect(repo.update('1', mockShopCar)).rejects.toThrow(HttpError);
    });

    test('Then it should execute method update', async () => {
      const mockShopCar = { userID: '1' } as ShopCar;
      const exec = jest.fn().mockResolvedValue(null);
      const mockRepo = {
        getById: jest.fn().mockResolvedValue({ orders: ['1', '2'] } as User),
        update: jest.fn(),
      } as unknown as UsersMongoRepo;

      UsersMongoRepo.prototype.getById = mockRepo.getById;
      UsersMongoRepo.prototype.update = mockRepo.update;

      ShopCarModel.findById = jest.fn().mockReturnValue({
        exec,
      });

      ShopCarModel.create = jest.fn().mockReturnValue({ id: '3' } as ShopCar);

      await repo.update(null, mockShopCar);
      expect(mockRepo.getById).toHaveBeenCalled();
    });

    test('Then it should execute method delete', async () => {
      const exec = jest.fn().mockResolvedValue('1');
      const mockRepo = {
        getById: jest.fn().mockResolvedValue({ orders: ['1', '2'] } as User),
        update: jest.fn(),
      } as unknown as UsersMongoRepo;

      UsersMongoRepo.prototype.getById = mockRepo.getById;
      UsersMongoRepo.prototype.update = mockRepo.update;

      ShopCarModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      ShopCarModel.findByIdAndDelete = jest.fn().mockReturnValue({ exec });

      await repo.delete('1');
      expect(mockRepo.getById).toHaveBeenCalled();
    });

    test('Then it should execute method delete with error', async () => {
      const exec = jest.fn().mockResolvedValue(null);
      const mockRepo = {
        getById: jest.fn().mockResolvedValue({ orders: ['1', '2'] } as User),
      } as unknown as UsersMongoRepo;

      UsersMongoRepo.prototype.getById = mockRepo.getById;

      ShopCarModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      await expect(repo.delete('3')).rejects.toThrow(HttpError);
    });
  });

  describe('When we instantiate it with errors', () => {
    const exec = jest.fn().mockResolvedValue(null);
    beforeEach(() => {
      const mockQueryMethod2 = jest.fn().mockReturnValue({
        exec,
      });

      ShopCarModel.findByIdAndDelete = mockQueryMethod2;
      ShopCarModel.findById = mockQueryMethod2;
      ShopCarModel.findByIdAndUpdate = mockQueryMethod2;

      repo = new ShopCarMongoRepo();
    });

    test('Then it should not execute get by id', async () => {
      await expect(repo.getById('1')).rejects.toThrow(HttpError);
    });

    test('Then it should not execute create', async () => {
      await expect(repo.create({} as ShopCar)).rejects.toThrow(Error);
    });
  });
});
