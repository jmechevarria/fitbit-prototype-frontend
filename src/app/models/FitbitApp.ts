import { FitbitAccount } from "./FitbitAccount";

export interface FitbitApp {
  id: string;
  secret: string;
  fitbitAccount: FitbitAccount;
}
