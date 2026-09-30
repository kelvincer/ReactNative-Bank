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

/**
 * MMKV es un modulo nativo de Nitro: importarlo pide el TurboModule real y
 * falla en Node. Se reemplaza por una instancia en memoria con la misma
 * superficie que los tests usan (`set`, `getString`, `remove`, `clearAll`).
 */
jest.mock('react-native-mmkv', () => {
  const store = new Map();

  return {
    __esModule: true,
    createMMKV: () => ({
      set: jest.fn((key, value) => { store.set(key, value); }),
      getString: jest.fn((key) => store.get(key)),
      contains: jest.fn((key) => store.has(key)),
      remove: jest.fn((key) => { store.delete(key); }),
      clearAll: jest.fn(() => { store.clear(); }),
      getAllKeys: jest.fn(() => [...store.keys()]),
    }),
  };
});

jest.mock('@react-native-vector-icons/material-design-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MockIcon = (props) =>
    React.createElement(Text, props, props.name ?? '');

  return { __esModule: true, default: MockIcon };
});