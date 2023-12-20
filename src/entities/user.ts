import { ImgData } from '../types/imgData.js';

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
  orders: string[];
  role: 'Admin' | 'User';
};
