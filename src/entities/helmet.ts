import { ImgData } from '../types/imgData';
import { ShopCar } from './shop_car';

export type Helmet = {
  id: string;
  reference: string;
  inventory: number;
  price: number;
  category: string;
  images: ImgData;
  orders: ShopCar[];
};
