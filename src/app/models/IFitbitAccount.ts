import { IClientAccount } from "./IClientAccount";

export interface IFitbitAccount extends IClientAccount {
  encoded_id: string;
  secret: string;
  fitbit_app_id: string;
  access_token?: string;
}
