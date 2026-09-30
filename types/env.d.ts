/**
 * Módulo virtual: lo crea `module:react-native-dotenv` (ver `babel.config.js`),
 * que reemplaza el import por el valor del `.env` correspondiente antes de
 * compilar. Solo se declaran las claves permitidas por `allowlist`.
 */
declare module '@env' {
  export const API_BASE_URL: string;
}