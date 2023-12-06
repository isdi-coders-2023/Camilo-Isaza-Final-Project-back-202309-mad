import { Helmet } from './helmet';
import { User } from './user';

export type ShopCar = {
  orderId: string;
  amount: number;
  helmet: Helmet;
  user: User;
};
