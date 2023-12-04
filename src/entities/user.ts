import { ImgData } from '../types/imgData.js';
import { ShopCar } from './shop_car.js';

export type LoginUser = {
  email: string;
  passwd: string;
};

export type User = LoginUser & {
  id: string;
  name: string;
  surname: string;
  age: number;
  avatar: ImgData;
  number: string;
  address: string;
  orders: ShopCar[];
};
