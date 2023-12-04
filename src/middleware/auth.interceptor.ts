import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import { Auth } from '../services/auth.js';
import { UsersMongoRepo } from '../repos/users_repo/users.mongo.repo.js';

const debug = createDebug('W8E:auth:interceptor');

export class AuthInterceptor {
  constructor() {
    debug('Instantiated');
  }

  authorization(req: Request, res: Response, next: NextFunction) {
    debug('hola');
    try {
      debug('hola');
      const tokenHeader = req.get('Authorization');
      if (!tokenHeader?.startsWith('Bearer'))
        throw new HttpError(401, 'Unauthorized');
      debug('hola');
      const token = tokenHeader.split(' ')[1];
      const tokenPayload = Auth.verifyAndGetPayload(token);
      req.body.userId = tokenPayload.id;

      next();
    } catch (error) {
      debug('hola');
      next(error);
    }
  }

  async authentication(req: Request, res: Response, next: NextFunction) {
    debug('hola');
    try {
      debug('hola');
      const userID = req.body.id;
      const userToAddID = req.params.id;
      const repoUsers = new UsersMongoRepo();
      const user = await repoUsers.getById(userToAddID);
      if (user.id !== userID)
        throw new HttpError(401, 'Unauthorized', 'User not valid');
      next();
    } catch (error) {
      debug('hola');
      next(error);
    }
  }
}
