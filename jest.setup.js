jest.mock('@react-native-async-storage/async-storage', () => {
  const store = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key) => Promise.resolve(store[key] ?? null)),
      setItem: jest.fn((key, value) => { store[key] = value; return Promise.resolve(); }),
      removeItem: jest.fn((key) => { delete store[key]; return Promise.resolve(); }),
      clear: jest.fn(() => Promise.resolve()),
    },
  };
});

jest.mock('@react-native-vector-icons/material-design-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MockIcon = (props) =>
    React.createElement(Text, props, props.name ?? '');

  return { __esModule: true, default: MockIcon };
});