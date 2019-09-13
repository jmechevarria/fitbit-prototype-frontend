import { FitbitApp } from "./FitbitApp";
import { Device } from "./Device";

export interface FitbitAccount {
  id: number;
  email: string;
  name: string;
  fitbitApp: FitbitApp;
}
