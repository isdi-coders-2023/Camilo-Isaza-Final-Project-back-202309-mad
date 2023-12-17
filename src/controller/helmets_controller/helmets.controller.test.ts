import { Request, Response } from 'express';
import { HelmetsController } from './helmets.controller';
import { HelmetsMongoRepo } from '../../repos/helmets_repo/helmets.repo.mongo';
import { Helmet } from '../../entities/helmet';

describe('Given UsersController class', () => {
  let controller: HelmetsController;
  let mockRequestHelmets: Request;
  let mockResponseHelmets: Response;
  let mockNextHelmets: jest.Mock;
  beforeEach(() => {
    mockRequestHelmets = {
      body: { loadedCategories: ['SK1', 'SK2'] },
      params: {},
      query: { key: 'value', categories: 'a,b,c' },
    } as unknown as Request;
    mockResponseHelmets = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
    mockNextHelmets = jest.fn();
  });
  describe('When we instantiate it without errors', () => {
    beforeEach(() => {
      const mockRepo = {
        create: jest.fn().mockResolvedValue({}),
        getAll: jest.fn().mockResolvedValue([{}]),
        getHelmetsByCategory: jest.fn().mockResolvedValue([{} as Helmet]),
      } as unknown as jest.Mocked<HelmetsMongoRepo>;

      controller = new HelmetsController(mockRepo);
    });

    test('Method newHelmet (create) should create a new helmet with valid input data and image file', async () => {
      const mockRequestHelmets = {
        file: {
          path: 'path',
        },
        body: {},
      } as unknown as Request;

      const mockNextHelmets = jest.fn();
      const mockRepo = {
        create: jest.fn(),
      } as unknown as HelmetsMongoRepo;

      const controller = new HelmetsController(mockRepo);
      const mockImageData = { url: 'https://example.com/image.jpg' };
      const mockCloudinaryService = {
        uploadImage: jest.fn().mockResolvedValue(mockImageData),
      };

      controller.cloudinaryService = mockCloudinaryService;

      await controller.newHelmet(
        mockRequestHelmets,
        mockResponseHelmets,
        mockNextHelmets
      );

      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(
        mockRequestHelmets.file?.path
      );
      expect(mockRequestHelmets.body.images).toBe(mockImageData);
    });

    test('Then method getAllHelmets should be called ', async () => {
      const mockNextHelmets = jest.fn();
      const mockRepo = {
        getAll: jest.fn().mockResolvedValue([{} as Helmet]),
      } as unknown as HelmetsMongoRepo;

      const controller = new HelmetsController(mockRepo);

      await controller.getAllHelmets(
        mockRequestHelmets,
        mockResponseHelmets,
        mockNextHelmets
      );

      expect(mockRepo.getAll).toHaveBeenCalled();
    });

    test('Then method getFavoriteHelmets should be called ', async () => {
      const mockNextHelmets = jest.fn();
      const mockRepo = {
        getHelmetsByFavorite: jest.fn().mockResolvedValue([{} as Helmet]),
      } as unknown as HelmetsMongoRepo;

      const controller = new HelmetsController(mockRepo);

      await controller.getFavoriteHelmets(
        mockRequestHelmets,
        mockResponseHelmets,
        mockNextHelmets
      );

      expect(mockRepo.getHelmetsByFavorite).toHaveBeenCalled();
    });

    test('Then method getHelmetsByCategory should be called ', async () => {
      const mockNextHelmets = jest.fn();
      const mockRepo = {
        getHelmetsByCategory: jest.fn().mockResolvedValue([{} as Helmet]),
      } as unknown as HelmetsMongoRepo;

      const controller = new HelmetsController(mockRepo);

      await controller.getHelmetsByCategory(
        mockRequestHelmets,
        mockResponseHelmets,
        mockNextHelmets
      );

      expect(mockRepo.getHelmetsByCategory).toHaveBeenCalled();
    });

    test('Then method getInitialCategoriesWithHelmets should be called ', async () => {
      const mockNextHelmets = jest.fn();
      const mockRepo = {
        getInitialCategories: jest.fn().mockResolvedValue(['a']),
      } as unknown as HelmetsMongoRepo;

      const controller = new HelmetsController(mockRepo);

      await controller.getInitialCategoriesWithHelmets(
        mockRequestHelmets,
        mockResponseHelmets,
        mockNextHelmets
      );

      expect(mockRepo.getInitialCategories).toHaveBeenCalled();
    });

    test('Then method getHelmetsByCategories should be called ', async () => {
      const mockNextHelmets = jest.fn();
      const mockRepo = {
        getHelmetsByCategories: jest.fn().mockResolvedValue([{} as Helmet]),
      } as unknown as HelmetsMongoRepo;

      const controller = new HelmetsController(mockRepo);
      await controller.getHelmetsByCategories(
        mockRequestHelmets,
        mockResponseHelmets,
        mockNextHelmets
      );

      expect(mockRepo.getHelmetsByCategories).toHaveBeenCalledWith(
        expect.arrayContaining(['a', 'b', 'c'])
      );
    });

    test('Then method getMoreHelmets should be called ', async () => {
      const mockNextHelmets = jest.fn();
      const mockRepo = {
        getHelmetsByCategory: jest.fn().mockResolvedValue([{} as Helmet]),
      } as unknown as HelmetsMongoRepo;

      const controller = new HelmetsController(mockRepo);

      await controller.getMoreHelmets(
        mockRequestHelmets,
        mockResponseHelmets,
        mockNextHelmets
      );

      expect(mockRepo.getHelmetsByCategory).toHaveBeenCalledWith('SK3');
    });

    test('Then method updateFavorite should be called ', async () => {
      const mockNextHelmets = jest.fn();
      const mockRepo = {
        updateFavorite: jest.fn().mockResolvedValue({} as Helmet),
      } as unknown as HelmetsMongoRepo;

      const controller = new HelmetsController(mockRepo);

      await controller.updateFavorite(
        mockRequestHelmets,
        mockResponseHelmets,
        mockNextHelmets
      );

      expect(mockRepo.updateFavorite).toHaveBeenCalled();
    });
  });

  describe('When we instantiate it with errors', () => {
    let mockError: Error;
    beforeEach(() => {
      mockError = new Error('Invalid Multer file');
      const mockRepo = {
        create: jest.fn().mockRejectedValue(mockError),
        getAll: jest.fn().mockRejectedValue(mockError),
        getFavoriteHelmets: jest.fn().mockRejectedValue(mockError),
        getHelmetsByCategory: jest.fn().mockRejectedValue(mockError),
        getInitialCategoriesWithHelmets: jest.fn().mockRejectedValue(mockError),
        getHelmetsByCategories: jest.fn().mockRejectedValue(mockError),
        getMoreHelmets: jest.fn().mockRejectedValue(mockError),
      } as unknown as HelmetsMongoRepo;

      controller = new HelmetsController(mockRepo);
    });

    test('Then register (create) should throw an error', async () => {
      await controller.newHelmet(
        mockRequestHelmets,
        mockResponseHelmets,
        mockNextHelmets
      );
      expect(mockNextHelmets).toHaveBeenCalledWith(mockError);
    });

    test('Then getAllHelmets should throw an error', async () => {
      await controller.getAllHelmets(
        mockRequestHelmets,
        mockResponseHelmets,
        mockNextHelmets
      );
      expect(mockNextHelmets).toHaveBeenCalledWith(expect.any(Error));
    });

    test('Then getHelmetsByCategory should throw an error', async () => {
      await controller.getHelmetsByCategory(
        mockRequestHelmets,
        mockResponseHelmets,
        mockNextHelmets
      );
      expect(mockNextHelmets).toHaveBeenCalledWith(expect.any(Error));
    });

    test('Then getFavoriteHelmets should throw an error', async () => {
      await controller.getFavoriteHelmets(
        mockRequestHelmets,
        mockResponseHelmets,
        mockNextHelmets
      );
      expect(mockNextHelmets).toHaveBeenCalledWith(expect.any(Error));
    });

    test('Then getInitialCategoriesWithHelmets should throw an error', async () => {
      await controller.getInitialCategoriesWithHelmets(
        mockRequestHelmets,
        mockResponseHelmets,
        mockNextHelmets
      );
      expect(mockNextHelmets).toHaveBeenCalledWith(expect.any(Error));
    });

    test('Then getHelmetsByCategories should throw an error', async () => {
      await controller.getHelmetsByCategories(
        mockRequestHelmets,
        mockResponseHelmets,
        mockNextHelmets
      );
      expect(mockNextHelmets).toHaveBeenCalledWith(expect.any(Error));
    });

    test('Then getMoreHelmets should throw an error', async () => {
      await controller.getMoreHelmets(
        mockRequestHelmets,
        mockResponseHelmets,
        mockNextHelmets
      );
      expect(mockNextHelmets).toHaveBeenCalledWith(expect.any(Error));
    });

    test('Then updateFavorite should throw an error', async () => {
      await controller.updateFavorite(
        mockRequestHelmets,
        mockResponseHelmets,
        mockNextHelmets
      );
      expect(mockNextHelmets).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
