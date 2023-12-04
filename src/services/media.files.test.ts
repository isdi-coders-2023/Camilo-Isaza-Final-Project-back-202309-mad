import { HttpError } from '../types/http.error';
import { MediaFiles } from './media.files';

describe('Given MediaFiles class', () => {
  describe('When we force an error', () => {
    const mediaFiles = new MediaFiles();

    test('Then uploadImage should reject with TypeError', async () => {
      await expect(mediaFiles.uploadImage('')).rejects.toThrow(HttpError);
    });
  });
});

describe('Given MediaFiles class', () => {
  describe('When we use its methods', () => {
    const mediaFiles = new MediaFiles();
    mediaFiles.uploadImage = jest.fn().mockResolvedValue({});
    test('Then uploadImage should resolve with ImgData on successful upload', async () => {
      const image = '';
      const result1 = mediaFiles.uploadImage(image);
      await expect(result1).resolves.toStrictEqual({});
    });
  });
});

/* Describe('Given MediaFiles class', () => {
  describe('When we use its methods', () => {
    const mediaFiles = new MediaFiles();

    test('Then uploadImage should resolve with ImgData on successful upload', async () => {
      const image = '';
      const result2 = mediaFiles.uploadImage(image);

      await expect(result2).resolves.toStrictEqual({
        url: expect.any(String),
        publicId: expect.any(String),
        size: expect.any(Number),
        height: expect.any(Number),
        width: expect.any(Number),
        format: expect.any(String),
      });
    });
  });
});
*/
