import { Helmet } from '../../entities/helmet';
import { HelmetModel } from './helmets.model.mongo.js';
import { Repository } from '../repo.js';
import { HttpError } from '../../types/http.error.js';
import createDebug from 'debug';
import { UsersMongoRepo } from '../users_repo/users.mongo.repo.js';
import crypto from 'crypto';

const debug = createDebug('W7E:notes:mongo:repo');

export class HelmetsMongoRepo implements Repository<Helmet> {
  userRepo: UsersMongoRepo;
  constructor() {
    this.userRepo = new UsersMongoRepo();
    debug('Instantiated');
  }

  async getAll(): Promise<Helmet[]> {
    const result = await HelmetModel.find().exec();
    return result;
  }

  async getById(id: string): Promise<Helmet> {
    const result = await HelmetModel.findById(id).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  async create(newItem: Omit<Helmet, 'id'>): Promise<Helmet> {
    const result: Helmet = await HelmetModel.create({
      ...newItem,
      id: crypto.randomUUID(),
    });

    return result;
  }

  async update(id: string, updatedItem: Partial<Helmet>): Promise<Helmet> {
    const result = await HelmetModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    }).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await HelmetModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }
  }
}
