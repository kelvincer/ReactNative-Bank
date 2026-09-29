const DEVELOPMENT_API_URL = "http://10.0.2.2:8080";
const PRODUCTION_API_URL = "https://api.cb.pe";

export const env = {
  apiBaseUrl: __DEV__ ? DEVELOPMENT_API_URL : PRODUCTION_API_URL,
};
