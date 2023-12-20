import { Schema, model, Types, SchemaDefinitionProperty } from 'mongoose';
import { ShopCar } from '../../entities/shop_car';

type UserIdType = SchemaDefinitionProperty<string, ShopCar> & {
  type: typeof Types.ObjectId;
  ref: string;
};

const ShopCarSchema = new Schema<ShopCar>({
  userID: {
    type: Types.ObjectId as unknown as UserIdType['type'],
    ref: 'User',
  } as UserIdType,
  items: {
    type: [
      {
        helmetId: { type: Schema.Types.ObjectId, ref: 'Helmet' },
        quantity: Number,
      },
    ],
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

ShopCarSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});

export const ShopCarModel = model('Shopcar', ShopCarSchema, 'shopcars');
