import { AuthInterceptor } from './auth.interceptor.js';
import { Request, Response, NextFunction } from 'express';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/http.error.js';
import { HelmetsMongoRepo } from '../repos/helmets_repo/helmets.repo.mongo';

jest.mock('../services/auth.js');

describe('Given AuthInterceptor class', () => {
  let authInterceptor: AuthInterceptor;

  beforeEach(() => {
    authInterceptor = new AuthInterceptor();
  });

  describe('When we use authorization method', () => {
    test('Then should set userId and tokenRole on the request body when Authorization header is valid', async () => {
      const req = {
        get: jest.fn(() => 'Bearer validToken'),
        body: {},
      } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      const mockPayload = { id: 'userId123', role: 'user' };
      (Auth.verifyAndGetPayload as jest.Mock).mockReturnValue(mockPayload);

      authInterceptor.authorization(req, res, next);

      expect(Auth.verifyAndGetPayload).toHaveBeenCalledWith('validToken');
      expect(mockPayload).toStrictEqual({ id: 'userId123', role: 'user' });
      expect(next).toHaveBeenCalled();
    });
    test('Then should call next with an HttpError when Authorization header is missing or invalid', async () => {
      const req = {
        get: jest.fn().mockReturnValue(null),
        body: {},
      } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      authInterceptor.authorization(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(HttpError));
    });
  });

  describe('', () => {
    test('should call next when tokenRole is "Admin"', () => {
      const req = { body: { tokenRole: 'Admin' } } as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      authInterceptor.isAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });
    test('should throw HttpError with status 403 when tokenRole is not "Admin"', () => {
      const req = { body: { tokenRole: 'User' } } as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      authInterceptor.isAdmin(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(HttpError));
    });
  });

  describe('', () => {
    test('Then it should set userId and tokenRole when token is valid', async () => {
      const mockPayload = { id: '1', role: 'Admin' as const, email: 'h@c' };
      const getByIdMock = jest.fn().mockResolvedValue(mockPayload);
      (
        HelmetsMongoRepo as jest.Mocked<typeof HelmetsMongoRepo>
      ).prototype.getById = getByIdMock;

      const req = {
        params: { id: '1' },
        body: { userId: '1', tokenRole: 'Admin' },
      } as any;
      const res = {} as any;
      const next = jest.fn();

      await authInterceptor.authentication(req, res, next);

      expect(req.body.userId).toBe('1');
      expect(req.body.tokenRole).toBe('Admin');
    });

    test('Then should call next with an HttpError when user.id !== userID', async () => {
      const mockPayload = { id: '2', role: 'Admin' as const, email: 'h@c' };

      const getByIdMock = jest.fn().mockResolvedValue(mockPayload);

      (
        HelmetsMongoRepo as jest.Mocked<typeof HelmetsMongoRepo>
      ).prototype.getById = getByIdMock;

      const req = {
        params: { id: '3' },
        body: { userId: '1', tokenRole: 'Admin' },
      } as any;

      const res = {} as any;
      const next = jest.fn() as NextFunction;

      console.log(req.params.id, req.body.userId);

      await authInterceptor.authentication(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
