import { errorMiddleware } from './error.middleware';
import { HttpError } from '../types/http.error';
import mongoose from 'mongoose';

describe('Given errorMiddleware', () => {
  describe('When we call it with different error types', () => {
    test('Then it should handle HttpError and set status and statusMessage accordingly', () => {
      const error = new HttpError(404, 'Not Found');
      const req = {} as any;
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      errorMiddleware(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.statusMessage).toBe('Not Found');
    });

    test('Then it should handle RangeError and set status and statusMessage accordingly', () => {
      const error = new RangeError('Request Range Not Satisfiable');
      const req = {} as any;
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      errorMiddleware(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(416);
      expect(res.statusMessage).toBe('Request Range Not Satisfiable');
    });

    test('Then it should handle ValidationError and set status and statusMessage accordingly', () => {
      const error = new mongoose.Error.ValidationError(undefined);
      const req = {} as any;
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      errorMiddleware(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.statusMessage).toBe('Bad Request');
    });

    test('Then it should handle MongoServerError and set status and statusMessage accordingly', () => {
      const errorDescription = {
        message: 'Not accepted',
        code: 406,
      };

      const error = new mongoose.mongo.MongoServerError(errorDescription);
      const req = {} as any;
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      errorMiddleware(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(406);
      expect(res.statusMessage).toBe('Not accepted');
    });

    test('Then it should handle other errors and set status and statusMessage to defaults', () => {
      const error = new Error('Internal Server Error');
      const req = {} as any;
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      errorMiddleware(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.statusMessage).toBe('Internal Server Error');
    });
  });
});
