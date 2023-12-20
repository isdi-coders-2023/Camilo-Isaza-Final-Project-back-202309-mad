export type Items = {
  helmetId: string;
  quantity: Number;
  id: string;
};

export type ShopCar = {
  id: string;
  userID: string;
  status: 'open' | 'approved' | 'rejected' | 'sent' | 'delivered';
  items: Items[];
};
