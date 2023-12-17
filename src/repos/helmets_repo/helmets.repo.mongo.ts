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

  async update(
    id: Helmet['id'],
    updatedItem: Partial<Helmet>
  ): Promise<Helmet> {
    const result = await HelmetModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    }).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async updateFavorite(id: Helmet['id'], isFavorite: boolean): Promise<Helmet> {
    const result = await HelmetModel.findByIdAndUpdate(
      id,
      { isFavorite },
      { new: true }
    ).exec();

    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');

    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await HelmetModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }
  }

  async getCategoriesWithHelmets(): Promise<string[]> {
    const helmets = await HelmetModel.find().exec();
    const categoriesWithHelmets = Array.from(
      new Set(helmets.map((helmet) => helmet.category))
    );
    return categoriesWithHelmets;
  }

  async getHelmetsByCategory(category: string): Promise<Helmet[]> {
    const helmetsInCategory = await HelmetModel.find({ category }).exec();
    return helmetsInCategory;
  }

  async getHelmetsByFavorite(): Promise<Helmet[]> {
    const favoriteHelmets = await HelmetModel.find({ isFavorite: true }).exec();
    return favoriteHelmets;
  }

  async getInitialCategories(): Promise<string[]> {
    const allCategories = [
      'SK2',
      'SK3',
      'SK4',
      'SK5',
      'SK6',
      'SK7',
      'SK8',
      'SK9',
      'SK10',
    ];

    const initialCategories = await HelmetModel.find({
      category: { $in: allCategories },
    })
      .sort({ category: 1 })
      .distinct('category')
      .exec();

    const firstTwoCategories = initialCategories.slice(0, 2);

    return firstTwoCategories;
  }

  async getHelmetsByCategories(categories: string[]): Promise<Helmet[]> {
    const helmets = await HelmetModel.find({
      category: { $in: categories },
    }).exec();
    return helmets;
  }
}
