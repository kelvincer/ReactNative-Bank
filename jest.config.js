module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|@react-navigation|@react-native-async-storage|react-native|react-native-paper|react-native-safe-area-context|react-native-screens)/)',
  ],
};