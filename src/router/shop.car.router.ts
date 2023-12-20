import { Router as createRouter } from 'express';
import { ShopCarController } from '../controller/shopCar_controller/shopCar_controller.js';
import createDebug from 'debug';
import { ShopCarMongoRepo } from '../repos/shopcar_repo/shopcar.mongo.repo.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';

const debug = createDebug('W7E:users:router');

export const shopCarRouter = createRouter();
debug('Starting');

const repo = new ShopCarMongoRepo();
const controller = new ShopCarController(repo);
const interceptor = new AuthInterceptor();

shopCarRouter.get('/', controller.getAll.bind(controller));

shopCarRouter.get(
  '/:id',

  controller.getById.bind(controller)
);

shopCarRouter.get(
  '/users/:userId',

  controller.getByUserId.bind(controller)
);

shopCarRouter.patch('/:id', controller.newShopCar.bind(controller));
shopCarRouter.patch('/', controller.newShopCar.bind(controller));

shopCarRouter.delete(
  '/:id',

  interceptor.authorization.bind(interceptor),
  controller.delete.bind(controller)
);
