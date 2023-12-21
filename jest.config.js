/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  coveragePathIgnorePatterns: [
    'src/repos/repo.ts',
    'src/repos/users_repo/users.mongo.model.ts',
    'src/repos/shopcar_repo/shopcar.mongo.model.ts',
    'src/repos/helmets_repo/helmets.model.mongo.ts',
    'src/app.ts',
    'src/index.ts',
    'src/router/users.router.ts',
    'src/router/helmets.router.ts',
    'src/router/shop.car.router.ts',
    'src/services/db.connect.ts',
  ],
};
