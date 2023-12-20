import { Request, Response } from 'express';
import { ShopCarController } from './shopCar_controller';
import { ShopCarMongoRepo } from '../../repos/shopcar_repo/shopcar.mongo.repo';
import { ShopCar } from '../../entities/shop_car';

describe('Given UsersController class', () => {
  let mockRequestShopcars: Request;
  let mockResponseShopcars: Response;

  beforeEach(() => {
    mockRequestShopcars = {
      body: { loadedCategories: ['SK1', 'SK2'] },
      params: {},
      query: { key: 'value', categories: 'a,b,c' },
    } as unknown as Request;
    mockResponseShopcars = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
  });
  describe('When we instantiate it without errors', () => {
    test('Method newShopCar (update) should create a new helmet with valid input data and image file', async () => {
      const mockRequestShopcars = {
        body: {},
      } as unknown as Request;

      const mockNextShopCars = jest.fn();
      const mockRepo = {
        update: jest.fn(),
      } as unknown as ShopCarMongoRepo;

      const controller = new ShopCarController(mockRepo);

      await controller.newShopCar(
        mockRequestShopcars,
        mockResponseShopcars,
        mockNextShopCars
      );
    });

    test('Then method getByUserId should be called ', async () => {
      const mockNextShopcars = jest.fn();
      const mockRepo = {
        getByUserId: jest.fn().mockResolvedValue([{} as ShopCar]),
      } as unknown as ShopCarMongoRepo;

      const controller = new ShopCarController(mockRepo);
      await controller.getByUserId(
        mockRequestShopcars,
        mockResponseShopcars,
        mockNextShopcars
      );

      expect(mockRepo.getByUserId).toHaveBeenCalled();
    });
  });
});
