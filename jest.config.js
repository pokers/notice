/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ["**/__test__/*.test.(ts|tsx)"],
    testPathIgnorePatterns: ["<rootDir>/dist/*", "<rootDir>/node_modules/*"]
  };