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
      console.log(req.body);
      const result = await this.repo.create(req.body);
      res.status(201);
      res.statusMessage = 'Created';
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
