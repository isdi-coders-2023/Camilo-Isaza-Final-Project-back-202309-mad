import { Router as createRouter } from 'express';
import { HelmetsController } from '../controller/helmets_controller/helmets.controller.js';
import createDebug from 'debug';
import { HelmetsMongoRepo } from '../repos/helmets_repo/helmets.repo.mongo.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FileInterceptor } from '../middleware/file.interceptor.js';

const debug = createDebug('W7E:helmets:router');

export const helmetsRouter = createRouter();
debug('Starting');

const repo = new HelmetsMongoRepo();
const controller = new HelmetsController(repo);
const interceptor = new AuthInterceptor();
const fileInterceptor = new FileInterceptor();

helmetsRouter.get(
  '/category/:category',
  controller.getHelmetsByCategory.bind(controller)
);

helmetsRouter.get(
  '/promotions',
  controller.getFavoriteHelmets.bind(controller)
);

helmetsRouter.get(
  '/initialCategories',
  controller.getInitialCategoriesWithHelmets.bind(controller)
);

helmetsRouter.get(
  '/helmetsByCategories',
  controller.getHelmetsByCategories.bind(controller)
);

helmetsRouter.post('/moreHelmets', controller.getMoreHelmets.bind(controller));

helmetsRouter.get(
  '/',

  controller.getAll.bind(controller)
);

helmetsRouter.get(
  '/:id',

  controller.getById.bind(controller)
);

helmetsRouter.post(
  '/',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  fileInterceptor.singleFileStore('images').bind(fileInterceptor),
  controller.newHelmet.bind(controller)
);
helmetsRouter.patch(
  '/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  fileInterceptor.singleFileStore('images').bind(fileInterceptor),
  controller.update.bind(controller)
);

helmetsRouter.patch(
  '/:id/favorite',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  controller.updateFavorite.bind(controller)
);

helmetsRouter.delete(
  '/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  controller.delete.bind(controller)
);
