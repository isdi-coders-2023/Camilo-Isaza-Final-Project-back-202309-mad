import { Schema, model } from 'mongoose';
import { Helmet } from '../../entities/helmet';

const helmetsSchema = new Schema<Helmet>({
  reference: {
    type: String,
    required: true,
  },
  inventory: {
    type: Number,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  images: {
    type: {
      publicId: String,
      size: Number,
      width: Number,
      height: Number,
      format: String,
      url: String,
    },
    required: true,
  },
  isFavorite: {
    type: Boolean,
    required: false,
    default: false,
  },
});

helmetsSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});

export const HelmetModel = model('Helmet', helmetsSchema, 'helmets');
