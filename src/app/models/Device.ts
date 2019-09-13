import { FitbitAccount } from "./FitbitAccount";

export interface Device {
  id: number;
  brand: string;
  model: string;
  fitbitAccount: FitbitAccount;
}
