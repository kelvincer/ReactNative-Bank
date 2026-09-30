module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        // Variable que elige el archivo de entorno (`.env.<APP_ENV>`)
        envName: 'APP_ENV',
        // Módulo virtual desde el que se importan las variables
        moduleName: '@env',
        // Solo se pueden importar estas claves
        allowlist: ['API_BASE_URL'],
        // Si una clave del allowlist no existe en los .env, el build falla
        allowUndefined: false,
      },
    ],
  ],
};
