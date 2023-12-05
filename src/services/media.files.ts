/* eslint-disable camelcase */
import { v2 as cloudinary } from 'cloudinary';
import createDebug from 'debug';
import { ImgData } from '../types/imgData';
import { HttpError } from '../types/http.error.js';
const debug = createDebug('W8E-MediaFile');

export class MediaFiles {
  constructor() {
    cloudinary.config({
      secure: true,
      api_key: '992612179227284',
      api_secret: process.env.CLOUDINARY_SECRET,
      cloud_name: 'dydb0lj4r',
    });
    debug('Intantiated');
  }

  async uploadImage(imagePath: string) {
    try {
      const uploadApiResponse = await cloudinary.uploader.upload(imagePath, {
        use_filename: true,
        unique_filename: true,
        overwrite: true,
      });

      const imgData: ImgData = {
        url: uploadApiResponse.url,
        publicId: uploadApiResponse.public_id,
        size: uploadApiResponse.bytes,
        height: uploadApiResponse.height,
        width: uploadApiResponse.width,
        format: uploadApiResponse.format,
      };

      return imgData;
    } catch (err) {
      const error = err as Error;
      throw new HttpError(
        406,
        'Not Acceptable',
        error.message || 'Unknown error'
      );
    }
  }
}
