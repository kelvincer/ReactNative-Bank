import { Credit } from "../../domain/Credit";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Detail: { credit: Credit };
  Payment: { credit: Credit }
};