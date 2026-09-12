import { Credit } from "../../domain/Credit";
import { Payment } from "../../domain/PayTypes";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Detail: { credit: Credit };
  Payment: { payment: Payment }
};