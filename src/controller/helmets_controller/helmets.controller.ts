import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { HelmetsMongoRepo } from '../../repos/helmets_repo/helmets.repo.mongo';
import { Controller } from '../controller.js';
import { HttpError } from '../../types/http.error.js';
import { Helmet } from '../../entities/helmet';

const debug = createDebug('W8E:users:controller');

export class HelmetsController extends Controller<Helmet> {
  constructor(protected repo: HelmetsMongoRepo) {
    super(repo);
    debug('Instantiated');
  }

  async newHelmet(req: Request, res: Response, next: NextFunction) {
    try {
      debug('hola');
      if (!req.file)
        throw new HttpError(406, 'Not Acceptable', 'Invalid Multer file');
      const imgData = await this.cloudinaryService.uploadImage(req.file?.path);
      req.body.images = imgData;
      const result = await this.repo.create(req.body);
      debug(req.body);
      debug(result);
      res.status(201);
      res.statusMessage = 'Created';
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllHelmets(req: Request, res: Response, next: NextFunction) {
    try {
      const allHelmets = await this.repo.getAll();
      res.json(allHelmets);
    } catch (error) {
      next(error);
    }
  }

  async getHelmetsByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.params;
      const helmetsForCategory = await this.repo.getHelmetsByCategory(category);
      res.json({ category, helmets: helmetsForCategory });
    } catch (error) {
      next(error);
    }
  }

  async getFavoriteHelmets(req: Request, res: Response, next: NextFunction) {
    try {
      const favoriteHelmets = await this.repo.getHelmetsByFavorite();
      res.json(favoriteHelmets);
    } catch (error) {
      next(error);
    }
  }

  async getInitialCategoriesWithHelmets(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const initialCategories = await this.repo.getInitialCategories();
      res.json(initialCategories);
    } catch (error) {
      next(error);
    }
  }

  async getHelmetsByCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const categories = req.query.categories as string;
      if (!categories) {
        throw new HttpError(
          400,
          'Bad Request',
          'Categories parameter is required'
        );
      }

      const categoriesArray = categories.split(',');
      const helmetsForCategories = await this.repo.getHelmetsByCategories(
        categoriesArray
      );

      res.json({ categories: categoriesArray, helmets: helmetsForCategories });
    } catch (error) {
      next(error);
    }
  }

  async getMoreHelmets(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { loadedCategories } = req.body;

      if (!loadedCategories || loadedCategories.length === 0) {
        throw new HttpError(
          400,
          'Bad Request',
          'Loaded categories are required'
        );
      }

      const remainingCategories = this.getRemainingCategories(loadedCategories);
      const nextCategory = remainingCategories[0];

      const helmetsForNextCategory = await this.repo.getHelmetsByCategory(
        nextCategory
      );

      if (helmetsForNextCategory.length === 0) {
        req.body.loadedCategories = [...loadedCategories, nextCategory];
        return this.getMoreHelmets(req, res, next);
      }

      req.body.loadedCategories = [...loadedCategories, nextCategory];

      res.json({
        category: nextCategory,
        helmets: helmetsForNextCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  private getRemainingCategories(loadedCategories: string[]): string[] {
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
    return allCategories.filter(
      (category) => !loadedCategories.includes(category)
    );
  }

  async updateFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.updateFavorite(
        req.params.id,
        req.body.isFavorite
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
