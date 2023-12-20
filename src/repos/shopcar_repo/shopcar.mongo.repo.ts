import { Repository } from '../repo.js';
import { HttpError } from '../../types/http.error.js';
import createDebug from 'debug';
import { UsersMongoRepo } from '../users_repo/users.mongo.repo.js';
import { HelmetsMongoRepo } from '../helmets_repo/helmets.repo.mongo.js';
import { ShopCar } from '../../entities/shop_car';
import { ShopCarModel } from './shopcar.mongo.model.js';
import crypto from 'crypto';

const debug = createDebug('W7E:shopcar:mongo:repo');

export class ShopCarMongoRepo implements Repository<ShopCar> {
  userRepo: UsersMongoRepo;
  helmetsRepo: HelmetsMongoRepo;
  constructor() {
    this.userRepo = new UsersMongoRepo();
    this.helmetsRepo = new HelmetsMongoRepo();
    debug('Instantiated');
  }

  async getAll(): Promise<ShopCar[]> {
    const result = await ShopCarModel.find().exec();
    return result;
  }

  async getById(id: string): Promise<ShopCar> {
    const result = await ShopCarModel.findById(id).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  async getByUserId(userId: string): Promise<ShopCar[]> {
    const result = await ShopCarModel.find({ userID: userId }).exec();

    return result;
  }

  // eslint-disable-next-line no-unused-vars
  async create(newItem: Omit<ShopCar, 'id'>): Promise<ShopCar> {
    throw new Error('Method not implemented.');
  }

  async update(
    id: string | null,
    updatedItem: Partial<ShopCar> | Omit<ShopCar, 'id'>
  ): Promise<ShopCar> {
    if (!id) {
      const { userID } = updatedItem;

      const newShopCarId = crypto.randomUUID();
      const result: ShopCar = await ShopCarModel.create({
        ...updatedItem,
        id: newShopCarId,
      });

      const user = await this.userRepo.getById(userID!);
      user.orders.push(result.id);
      await this.userRepo.update(userID!, user);

      return result;
    }

    const result = await ShopCarModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
      upsert: false,
      setDefaultsOnInsert: false,
    }).exec();

    if (!result) {
      throw new HttpError(404, 'Not Found', 'Update not possible');
    }

    return result;
  }

  async delete(id: string): Promise<void> {
    const orderToDelete = await ShopCarModel.findById(id)
      .populate('userID', '_id')
      .exec();

    if (!orderToDelete) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }

    const userIdentification = orderToDelete.userID;
    const user = await this.userRepo.getById(userIdentification);

    if (user) {
      user.orders = user.orders.filter((orderId) => orderId.toString() !== id);
      await this.userRepo.update(userIdentification, user);
    }

    await ShopCarModel.findByIdAndDelete(id).exec();
  }
}
