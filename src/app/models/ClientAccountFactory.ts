import { IClientAccount } from "./IClientAccount";
import { FitbitAccount } from "./FitbitAccount";
import { GarminAccount } from "./GarminAccount";
import { ClientAccount } from "./ClientAccount";

export class ClientAccountFactory {
  constructor() {}

  public static createClientAccount(type_id: number, params?): ClientAccount {
    if (type_id === 1) {
      return new FitbitAccount(params);
    } else if (type_id === 2) {
      return new GarminAccount(params);
    }
  }
}
