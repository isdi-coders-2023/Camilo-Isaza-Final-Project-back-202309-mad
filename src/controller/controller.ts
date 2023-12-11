/* eslint-disable no-unused-vars */
import { Repository } from '../repos/repo';
import { NextFunction, Request, Response } from 'express';
import { MediaFiles } from '../services/media.files.js';

import createDebug from 'debug';

const debug = createDebug('W7E:helmets:controller');

export abstract class Controller<T extends { id: unknown }> {
  cloudinaryService: MediaFiles;

  constructor(protected repo: Repository<T>) {
    this.cloudinaryService = new MediaFiles();
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.getAll();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.getById(req.params.id);
      debug('hola yo');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      debug('hola');
      const result = await this.repo.update(req.params.id, req.body);
      debug(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      debug('hola');
      await this.repo.delete(req.params.id);
      res.status(204);
      res.statusMessage = 'No Content';
      res.json({});
    } catch (error) {
      next(error);
    }
  }
}
