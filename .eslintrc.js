module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['jest.setup.js', 'jest.config.js', 'babel.config.js', 'metro.config.js'],
      env: { jest: true, node: true },
    },
    {
      files: ['__tests__/**/*.{js,ts,tsx}'],
      env: { jest: true },
    },
  ],
};
