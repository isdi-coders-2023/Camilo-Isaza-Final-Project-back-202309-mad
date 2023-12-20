import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { ShopCarMongoRepo } from '../../repos/shopcar_repo/shopcar.mongo.repo.js';
import { Controller } from '../controller.js';
import { ShopCar } from '../../entities/shop_car';

const debug = createDebug('W8E:users:controller');

export class ShopCarController extends Controller<ShopCar> {
  constructor(protected repo: ShopCarMongoRepo) {
    super(repo);
    debug('Instantiated');
  }

  async newShopCar(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.update(req.params.id, req.body);
      res.status(201);
      res.statusMessage = 'Updated';
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const shopCars = await this.repo.getByUserId(userId);
      res.status(200).json(shopCars);
    } catch (error) {
      next(error);
    }
  }
}
