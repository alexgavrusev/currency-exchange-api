module.exports = {
  modulePaths: ['<rootDir>'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    'fp-ts-std/(.*)': 'fp-ts-std/dist/cjs/$1',
  },
};
