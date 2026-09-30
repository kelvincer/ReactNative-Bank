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