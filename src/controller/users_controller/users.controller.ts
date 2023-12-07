import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { UsersMongoRepo } from '../../repos/users_repo/users.mongo.repo.js';
import { Auth } from '../../services/auth.js';
import { User } from '../../entities/user.js';
import { Controller } from './../controller.js';
import { LoginResponse } from '../../types/login_response.js';
import { HttpError } from '../../types/http.error.js';

const debug = createDebug('W8E:users:controller');

export class UsersController extends Controller<User> {
  constructor(protected repo: UsersMongoRepo) {
    super(repo);
    debug('Instantiated');
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = req.body.userId
        ? await this.repo.getById(req.body.userId)
        : await this.repo.login(req.body);

      const data: LoginResponse = {
        user: result,
        token: Auth.signJWT({
          id: result.id,
          email: result.email,
          role: result.role,
        }),
      };
      res.status(202).json(data);
      res.status(202).send('Accepted');
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file)
        throw new HttpError(406, 'Not Acceptable', 'Invalid Multer file');
      const imgData = await this.cloudinaryService.uploadImage(req.file?.path);
      req.body.avatar = imgData;

      const result = await this.repo.create(req.body);
      res.status(201);
      res.statusMessage = 'Created';
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
