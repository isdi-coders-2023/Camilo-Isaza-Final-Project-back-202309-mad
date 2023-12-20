import { ImgData } from '../types/imgData';

export type Helmet = {
  id: string;
  reference: string;
  inventory: number;
  price: number;
  category: string;
  images: ImgData;
  isFavorite: boolean;
};
