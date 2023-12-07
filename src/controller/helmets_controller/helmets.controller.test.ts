import { Request, Response } from 'express';
import { HelmetsController } from './helmets.controller';
import { HelmetsMongoRepo } from '../../repos/helmets_repo/helmets.repo.mongo';

describe('Given UsersController class', () => {
  let controller: HelmetsController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: jest.Mock;
  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: { key: 'value' },
    } as unknown as Request;
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
  });
  describe('When we instantiate it without errors', () => {
    beforeEach(() => {
      const mockRepo = {
        register: jest.fn().mockResolvedValue({}),
      } as unknown as jest.Mocked<HelmetsMongoRepo>;

      controller = new HelmetsController(mockRepo);
    });

    test('Method newHelmet (create) should create a new helmet with valid input data and image file', async () => {
      const mockRequest = {
        file: {
          path: 'path',
        },
        body: {},
      } as unknown as Request;

      const mockNext = jest.fn();
      const mockRepo = {
        create: jest.fn(),
      } as unknown as HelmetsMongoRepo;

      const controller = new HelmetsController(mockRepo);
      const mockImageData = { url: 'https://example.com/image.jpg' };
      const mockCloudinaryService = {
        uploadImage: jest.fn().mockResolvedValue(mockImageData),
      };

      controller.cloudinaryService = mockCloudinaryService;

      await controller.newHelmet(mockRequest, mockResponse, mockNext);

      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(
        mockRequest.file?.path
      );
      expect(mockRequest.body.images).toBe(mockImageData);
    });
  });

  describe('When we instantiate it with errors', () => {
    let mockError: Error;
    beforeEach(() => {
      mockError = new Error('Invalid Multer file');
      const mockRepo = {
        login: jest.fn().mockRejectedValue(mockError),
        create: jest.fn().mockRejectedValue(mockError),
      } as unknown as HelmetsMongoRepo;

      controller = new HelmetsController(mockRepo);
    });

    test('Then register (create) should throw an error', async () => {
      await controller.newHelmet(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
