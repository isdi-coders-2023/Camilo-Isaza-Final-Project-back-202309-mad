/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  coveragePathIgnorePatterns: [
    'src/repos/repo.ts',
    'src/repos/users_repo/users.mongo.model.ts',
    'src/app.ts',
    'src/index.ts',
    'src/router/users.router.ts',
    'src/services/db.connect.ts',
  ],
};
