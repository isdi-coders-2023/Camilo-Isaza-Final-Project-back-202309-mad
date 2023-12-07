import { Router as createRouter } from 'express';
import { UsersController } from '../controller/users_controller/users.controller.js';
import createDebug from 'debug';
import { UsersMongoRepo } from '../repos/users_repo/users.mongo.repo.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FileInterceptor } from '../middleware/file.interceptor.js';

const debug = createDebug('W7E:users:router');

export const usersRouter = createRouter();
debug('Starting');

const repo = new UsersMongoRepo();
const controller = new UsersController(repo);
const interceptor = new AuthInterceptor();
const fileInterceptor = new FileInterceptor();

usersRouter.get(
  '/',
  interceptor.authorization.bind(interceptor),
  controller.getAll.bind(controller)
);

usersRouter.get(
  '/:id',
  interceptor.authorization.bind(interceptor),
  controller.getById.bind(controller)
);

usersRouter.post(
  '/register',
  fileInterceptor.singleFileStore('avatar').bind(fileInterceptor),
  controller.register.bind(controller)
);

usersRouter.post('/login', controller.login.bind(controller));

usersRouter.patch(
  '/:id',
  interceptor.authorization.bind(interceptor),
  controller.update.bind(controller)
);

usersRouter.delete(
  '/:id',

  interceptor.authorization.bind(interceptor),
  controller.delete.bind(controller)
);
