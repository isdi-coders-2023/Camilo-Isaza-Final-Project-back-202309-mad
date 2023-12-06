import { UsersMongoRepo } from '../repos/users_repo/users.mongo.repo';
import { Auth } from '../services/auth';

import { AuthInterceptor } from './auth.interceptor';

jest.mock('../services/auth');
jest.mock('../repos/users_repo/users.mongo.repo');

describe('Given class auth interceptor', () => {
  describe('When we call its methods', () => {
    let authInterceptor: AuthInterceptor;

    beforeEach(() => {
      authInterceptor = new AuthInterceptor();
    });

    test('Then it should set userId and tokenRole when token is valid', async () => {
      const mockPayload = { id: '1', role: 'Admin' as const, email: 'h@c' };
      (Auth as jest.Mocked<typeof Auth>).verifyAndGetPayload.mockReturnValue(
        mockPayload
      );
      const req = {
        get: jest.fn().mockReturnValue('Bearer validToken'),
        body: {},
      } as any;
      const res = {} as any;
      const next = jest.fn();

      await authInterceptor.authorization(req, res, next);

      expect(req.body.userId).toBe('1');
      expect(req.body.tokenRole).toBe('Admin');
    });
    test('Then it should set userId and tokenRole when token is valid', async () => {
      const mockPayload = { id: '1', role: 'Admin' as const, email: 'h@c' };
      const getByIdMock = jest.fn().mockResolvedValue(mockPayload);
      (UsersMongoRepo as jest.Mocked<typeof UsersMongoRepo>).prototype.getById =
        getByIdMock;

      const req = {
        params: { id: '1' }, // Set the 'id' property in params
        body: { userId: '1', tokenRole: 'Admin' }, // Set the 'id' property in body
      } as any;
      const res = {} as any;
      const next = jest.fn();

      await authInterceptor.authentication(req, res, next);

      console.log('req.body:', req.body);

      expect(req.body.userId).toBe('1');
      expect(req.body.tokenRole).toBe('Admin');
    });

    test('should call next() if tokenRole is Admin', async () => {
      const req = {
        body: { tokenRole: 'Admin' },
      } as any;
      const res = {} as any;
      const next = jest.fn();

      await authInterceptor.isAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
